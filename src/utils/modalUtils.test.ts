import {
  disableBodyScroll,
  enableBodyScroll,
  trapFocus,
  showInert,
  hideInert
} from './modalUtils'

describe('modalUtils', () => {
  let mockDocument: any
  let originalDocument: any

  beforeAll(() => {
    originalDocument = global.document
  })

  afterAll(() => {
    global.document = originalDocument
  })

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Criar um mock completo do document
    mockDocument = {
      body: {
        style: {
          overflow: '',
          setProperty: jest.fn(),
          getPropertyValue: jest.fn()
        }
      },
      activeElement: null,
      querySelectorAll: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }
    
    // Substituir o document global
    global.document = mockDocument
  })

  describe('disableBodyScroll', () => {
    it('deve definir overflow do body como hidden', () => {
      disableBodyScroll()
      expect(global.document.body.style.overflow).toBe('hidden')
    })

    it('deve funcionar quando document não está disponível', () => {
      const originalDocument = global.document
      // @ts-ignore
      global.document = undefined
      
      expect(() => disableBodyScroll()).not.toThrow()
      
      global.document = originalDocument
    })
  })

  describe('enableBodyScroll', () => {
    it('deve restaurar overflow do body para string vazia', () => {
      // Primeiro definir como hidden
      global.document.body.style.overflow = 'hidden'
      enableBodyScroll()
      expect(global.document.body.style.overflow).toBe('')
    })

    it('deve funcionar quando document não está disponível', () => {
      const originalDocument = global.document
      // @ts-ignore
      global.document = undefined
      
      expect(() => enableBodyScroll()).not.toThrow()
      
      global.document = originalDocument
    })
  })

  describe('trapFocus', () => {
    it('deve adicionar event listener para keydown', () => {
      const mockElement = {
        querySelectorAll: jest.fn().mockReturnValue([]),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      } as any

      trapFocus(mockElement)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('deve retornar função de cleanup', () => {
      const mockElement = {
        querySelectorAll: jest.fn().mockReturnValue([]),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      } as any

      const cleanup = trapFocus(mockElement)
      expect(typeof cleanup).toBe('function')
      
      cleanup()
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('deve focar no primeiro elemento quando Tab é pressionado no último elemento', () => {
      const mockFirstElement = { focus: jest.fn() }
      const mockLastElement = { focus: jest.fn() }
      const mockElements = [mockFirstElement, mockLastElement]
      
      const mockElement = {
        querySelectorAll: jest.fn().mockReturnValue(mockElements),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      } as any

      // Mock do document.activeElement usando Object.defineProperty
      Object.defineProperty(global.document, 'activeElement', {
        value: mockLastElement,
        writable: true,
        configurable: true
      })

      trapFocus(mockElement)
      
      const keydownHandler = (mockElement.addEventListener as jest.Mock).mock.calls[0][1]
      const mockEvent = {
        key: 'Tab',
        shiftKey: false,
        preventDefault: jest.fn()
      }

      keydownHandler(mockEvent)

      expect(mockFirstElement.focus).toHaveBeenCalled()
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('deve focar no último elemento quando Shift+Tab é pressionado no primeiro elemento', () => {
      const mockFirstElement = { focus: jest.fn() }
      const mockLastElement = { focus: jest.fn() }
      const mockElements = [mockFirstElement, mockLastElement]
      
      const mockElement = {
        querySelectorAll: jest.fn().mockReturnValue(mockElements),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      } as any

      // Mock do document.activeElement usando Object.defineProperty
      Object.defineProperty(global.document, 'activeElement', {
        value: mockFirstElement,
        writable: true,
        configurable: true
      })

      trapFocus(mockElement)
      
      const keydownHandler = (mockElement.addEventListener as jest.Mock).mock.calls[0][1]
      const mockEvent = {
        key: 'Tab',
        shiftKey: true,
        preventDefault: jest.fn()
      }

      keydownHandler(mockEvent)

      expect(mockLastElement.focus).toHaveBeenCalled()
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('deve funcionar quando não há elementos focáveis', () => {
      const mockElement = {
        querySelectorAll: jest.fn().mockReturnValue([]),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      } as any

      expect(() => trapFocus(mockElement)).not.toThrow()
    })
  })

  describe('showInert', () => {
    it('deve remover atributo inert', () => {
      const mockElement = {
        removeAttribute: jest.fn()
      } as any

      showInert(mockElement)
      expect(mockElement.removeAttribute).toHaveBeenCalledWith('inert')
    })
  })

  describe('hideInert', () => {
    it('deve adicionar atributo inert', () => {
      const mockElement = {
        setAttribute: jest.fn()
      } as any

      hideInert(mockElement)
      expect(mockElement.setAttribute).toHaveBeenCalledWith('inert', '')
    })
  })
})