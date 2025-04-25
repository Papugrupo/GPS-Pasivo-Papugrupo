import React, { useState } from 'react';
import { registrarUsuario } from '../services/usuario.service';

const RegistrarUsuario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        contrasena: '',
        repetirContrasena: ''
    });

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'contrasena' || name === 'repetirContrasena') {
            if (name === 'contrasena') {
                verificarContraseñas(value, formData.repetirContrasena);
            } else {
                verificarContraseñas(formData.contrasena, value);
            }
        }

        if (name === 'correo') {
            verificarCorreo(value);
        }
    };

    const verificarCorreo = (email) => {
        if (email === '') {
            setEmailError('');
            return;
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regex.test(email)) {
            setEmailError('Debe ingresar un correo válido');
        } else {
            setEmailError('');
        }
    };

    const verificarContraseñas = (pass1, pass2) => {
        if (pass1 === '' || pass2 === '') {
            setPasswordError('');
            return;
        }

        if (pass1 !== pass2) {
            setPasswordError('Las contraseñas no coinciden');
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        // Validate form
        if (!formData.nombre) {
            return alert('Ingrese un nombre');
        }

        if (!formData.correo || emailError) {
            setEmailError(formData.correo ? emailError : 'Ingrese un correo electrónico');
            return;
        }

        if (!formData.contrasena) {
            setPasswordError('Ingrese una contraseña');
            return;
        }

        if (formData.contrasena !== formData.repetirContrasena) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }


        const userData = {
            email: formData.correo,
            nombre: formData.nombre,
            contrasena: formData.contrasena,
            direccion: formData.direccion,
            telefono: formData.telefono,     
        };

        try {
            setIsSubmitting(true);
            const response = await registrarUsuario(userData);
            setSubmitSuccess('Te haz registrado exitosamente. Ahora puedes iniciar sesión.');
            
            setFormData({
                nombre: '',
                direccion: '',
                telefono: '',
                correo: '',
                contrasena: '',
                repetirContrasena: ''
            });
        } catch (error) {
            console.error('Error al registrar:', error);
            setSubmitError(error.response?.data?.message || 'Error al registrar usuario. Intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[url('/assets/fondo.png')] flex items-center justify-center p-4 md:p-8">
            <div className="bg-white bg-opacity-95 p-5 sm:p-6 md:p-8 rounded-lg shadow-lg  w-full max-w-xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4 md:mb-6">
                    Registro
                </h1>

                {submitSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                        {submitSuccess}
                    </div>
                )}

                {submitError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {submitError}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-gray-700 font-semibold sm:w-40">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-gray-700 font-semibold sm:w-40">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-gray-700 font-semibold sm:w-40">N° Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
                        <label className="text-gray-700 font-semibold sm:w-40">Correo</label>
                        <div className="flex flex-col w-full">
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className={`w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
                                required
                            />
                            {emailError && (
                                <p className="text-red-500 text-sm mt-1">{emailError}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-gray-700 font-semibold sm:w-40">Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            className="w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-gray-700 font-semibold sm:w-40">Repetir contraseña</label>
                        <div className="w-full">
                            <input
                                type="password"
                                name="repetirContrasena"
                                value={formData.repetirContrasena}
                                onChange={handleChange}
                                className={`w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${passwordError ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
                                required
                            />
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-musgo hover:bg-musgo2'} text-black py-2 rounded-lg font-semibold transition duration-200`}
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrarUsuario;