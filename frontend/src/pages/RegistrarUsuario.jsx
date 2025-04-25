import React, { useState } from 'react';

const RegistrarUsuario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        codigo: '',
        contrasena: '',
        repetirContrasena: ''
    });

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [codigoError, setCodigoError] = useState('');
    const [codigoVerificado, setCodigoVerificado] = useState(false);

    const CODIGO_VALIDO = "12345"

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

    const solicitarCodigo = () => {
        if (!formData.correo) {
            setEmailError('Ingrese un correo electrónico');
            return;
        }

        if (emailError) {
            return;
        }

        console.log('Solicitando código para:', formData.correo);
        alert('Código enviado a ' + formData.correo);
    };

    const verificarCodigo = () => {
        if (!formData.codigo) {
            setCodigoError('Ingrese el código de verificación');
            return;
        }

        if (formData.codigo === CODIGO_VALIDO) {
            setCodigoError('');
            setCodigoVerificado(true);
            alert('Código verificado correctamente');
        } else {
            setCodigoError('Código incorrecto');
            setCodigoVerificado(false);
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


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.correo || emailError) {
            setEmailError(formData.correo ? emailError : 'Ingrese un correo electrónico');
            return;
        }

        if (formData.contrasena !== formData.repetirContrasena) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }


        console.log('Formulario enviado:', formData);

    };

    return (
        <div className="min-h-screen w-full bg-[url('/assets/fondo.png')] flex items-center justify-center p-4 md:p-8">
            <div className="bg-white bg-opacity-95 p-5 sm:p-6 md:p-8 rounded-lg shadow-lg  w-full max-w-xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4 md:mb-6">
                    Registro
                </h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-gray-700 font-semibold sm:w-40">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={solicitarCodigo}
                                    className="py-2 px-3 border rounded-lg bg-blue-100 hover:bg-blue-200 whitespace-nowrap"
                                >
                                    Solicitar Código
                                </button>
                            </div>
                            {emailError && (
                                <p className="text-red-500 text-sm mt-1">{emailError}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
                        <label className="text-gray-700 font-semibold sm:w-40">Código</label>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <input
                                    type="text"
                                    name="codigo"
                                    value={formData.codigo}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${codigoError ? 'border-red-500 focus:ring-red-400' : codigoVerificado ? 'border-green-500 focus:ring-green-400' : 'focus:ring-blue-400'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={verificarCodigo}
                                    className="py-2 px-3 border rounded-lg bg-blue-100 hover:bg-blue-200 whitespace-nowrap"
                                >
                                    Verificar Código
                                </button>
                            </div>
                            {codigoError && (
                                <p className="text-red-500 text-sm mt-1">{codigoError}</p>
                            )}
                            {codigoVerificado && (
                                <p className="text-green-600 text-sm mt-1">Código verificado correctamente</p>
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
                                className={`w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${passwordError ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'
                                    }`}
                            />
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-musgo text-black py-2 rounded-lg font-semibold hover:bg-musgo2 transition duration-200"
                        >
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrarUsuario;