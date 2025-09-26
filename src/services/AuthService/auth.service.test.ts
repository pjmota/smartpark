import { authService } from './auth.service'
import api from '../api.service'
import { LoginCredentials } from '@/types/auth.type'

// Mock do api service
jest.mock('../api.service')
const mockedApi = api as jest.Mocked<typeof api>

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  describe('login', () => {
    const mockCredentials: LoginCredentials = {
      username: 'testuser',
      password: 'testpass'
    }

    const mockApiResponse = {
      data: {
        data: {
          token: 'mock-token',
          expiredIn: '2024-12-31T23:59:59Z'
        },
        message: 'Login successful'
      }
    }

    it('deve fazer login com sucesso e armazenar dados', async () => {
      mockedApi.post.mockResolvedValue(mockApiResponse)

      const result = await authService.login(mockCredentials)

      expect(mockedApi.post).toHaveBeenCalledWith('/login', {
        username: 'testuser',
        password: 'testpass'
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
        token: 'mock-token',
        expiredIn: '2024-12-31T23:59:59Z',
        username: 'testuser'
      }))

      expect(result).toEqual({
        token: 'mock-token',
        expiredIn: '2024-12-31T23:59:59Z',
        user: {
          username: 'testuser'
        }
      })
    })

    it('deve lançar erro quando não há token na resposta', async () => {
      const mockResponseWithoutToken = {
        data: {
          data: null,
          message: 'Invalid credentials'
        }
      }

      mockedApi.post.mockResolvedValue(mockResponseWithoutToken)

      await expect(authService.login(mockCredentials)).rejects.toThrow('Invalid credentials')
    })

    it('deve lançar erro para credenciais inválidas (401)', async () => {
      const mockError = new Error('Request failed with status code 401')
      mockedApi.post.mockRejectedValue(mockError)

      await expect(authService.login(mockCredentials)).rejects.toThrow('Credenciais inválidas')
    })

    it('deve lançar erro genérico para outros erros', async () => {
      const mockError = new Error('Network error')
      mockedApi.post.mockRejectedValue(mockError)

      await expect(authService.login(mockCredentials)).rejects.toThrow('Network error')
    })
  })

  describe('logout', () => {
    it('deve remover token e dados do usuário do localStorage', () => {
      authService.logout()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('isAuthenticated', () => {
    it('deve retornar false quando não há window (SSR)', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const result = authService.isAuthenticated()

      expect(result).toBe(false)

      global.window = originalWindow
    })

    it('deve retornar false quando não há token', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
    })

    it('deve retornar false quando não há dados do usuário', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'mock-token'
        if (key === 'user') return null
        return null
      })

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
    })

    it('deve retornar true quando token é válido e não expirou', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'mock-token'
        if (key === 'user') return JSON.stringify({
          username: 'testuser',
          token: 'mock-token',
          expiredIn: futureDate.toISOString()
        })
        return null
      })

      const result = authService.isAuthenticated()

      expect(result).toBe(true)
    })

    it('deve retornar false e fazer logout quando token expirou', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'mock-token'
        if (key === 'user') return JSON.stringify({
          username: 'testuser',
          token: 'mock-token',
          expiredIn: pastDate.toISOString()
        })
        return null
      })

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })

    it('deve retornar false e fazer logout quando dados do usuário são inválidos', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'mock-token'
        if (key === 'user') return 'invalid-json'
        return null
      })

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('getCurrentUser', () => {
    it('deve retornar null quando não há window (SSR)', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const result = authService.getCurrentUser()

      expect(result).toBe(null)

      global.window = originalWindow
    })

    it('deve retornar dados do usuário quando válidos', () => {
      const mockUser = {
        username: 'testuser',
        token: 'mock-token',
        expiredIn: '2024-12-31T23:59:59Z'
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

      const result = authService.getCurrentUser()

      expect(result).toEqual(mockUser)
    })

    it('deve retornar null quando dados são inválidos', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')

      const result = authService.getCurrentUser()

      expect(result).toBe(null)
    })

    it('deve retornar null quando não há dados', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = authService.getCurrentUser()

      expect(result).toBe(null)
    })
  })
})