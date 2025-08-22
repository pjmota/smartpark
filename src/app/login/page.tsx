"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "@/assets/estapar_logo.png";
import {
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
  });

  const handleChange = (field: 'username' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));

    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      username: "",
      password: "",
    };

    if (!formData.username.trim()) {
      errors.username = "O usuário é obrigatório";
    }

    if (!formData.password) {
      errors.password = "A senha é obrigatória";
    }

    setValidationErrors(errors);
    return !errors.username && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      toast.success("Login realizado com sucesso!")
    } catch (error) {
      toast.error(`${error}`)
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Image
          src={Logo}
          alt="Logo Estapar"
          width={160}
          height={120}
          className="mx-auto mb-8"
        />
        <div className="p-8  bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-left text-gray-800 text-sm font-semibold mb-6 whitespace-nowrap">
            Entre com suas credenciais para acessar o sistema
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormControl 
              variant="outlined" 
              fullWidth 
              size="small"
              sx={{marginBottom: '2rem'}}
            >
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Usuário
              </label>
              <OutlinedInput
                id="user"
                type="text"
                placeholder="Digite seu usuário"
                className="h-10"
                value={formData.username}
                onChange={handleChange('username')}
                startAdornment={
                  <InputAdornment position="start">
                    <User className="text-gray-400 w-5 h-5" />
                  </InputAdornment>
                }
                sx={{
                  "& input::placeholder": {
                    fontSize: "0.85rem",
                  },
                }}
              />
            </FormControl>
            <FormControl 
              variant="outlined" 
              fullWidth 
              size="small"
              sx={{marginBottom: '2rem'}}
            >
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Senha
              </label>
              <OutlinedInput
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="h-10"
                value={formData.password}
                onChange={handleChange('password')}
                startAdornment={
                  <InputAdornment position="start">
                    <Lock className="text-gray-400 w-5 h-5" />
                  </InputAdornment>
                }
                sx={{
                  "& input::placeholder": {
                    fontSize: "0.85rem",
                  },
                }}
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="h-10 rounded-md normal-case font-medium"
              size="medium"
              sx={{
                backgroundColor: "#7ad33e",
                color: "#fff",
                "&:hover": { backgroundColor: "#6ac230" },
                textTransform: "none"
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
