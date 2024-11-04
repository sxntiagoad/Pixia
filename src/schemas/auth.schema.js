import { z } from "zod";

export const registerSchema = z.object({  
    username: z.string({
        required_error: "El nombre de usuario es requerido"
    }).min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres"
    }).max(255),
    email: z.string({
        required_error: "El correo electrónico es requerido"
    }).email({
        message: "El correo electrónico no es válido"
    }).max(255),
    password: z.string({
        required_error: "La contraseña es requerida"
    }).min(6, {
        message: "La contraseña debe tener al menos 6 caracteres"
    }).max(255),
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "El correo electrónico es requerido"
    }).email({
        message: "El correo electrónico no es válido"
    }).max(255),
    password: z.string({
        required_error: "La contraseña es requerida"
    }).min(6, {
        message: "La contraseña debe tener al menos 6 caracteres"
    }).max(255),
});