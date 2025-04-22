import React, { useState } from 'react';

const especieOptions = ['Perro', 'Gato', 'Ave', 'Conejo', 'Otro'];
const razaOptions = {
  Perro: ['Labrador', 'Poodle', 'Bulldog', 'Pastor Alemán'],
  Gato: ['Persa', 'Siames', 'Maine Coon', 'Sphynx'],
  Ave: ['Periquito', 'Canario', 'Loro'],
  Conejo: ['Enano', 'Cabeza de León', 'Angora'],
  Otro: ['Otro']
};

const nuevaMascota = () => ({
  nombre: '',
  especie: 'Perro',
  raza: '',
  sexo: '',
  fechaNacimiento: '',
  color: '',
  tamano: '',
  esterilizado: false,
  numeroMicrochip: '',
  fechaMicrochip: '',
  urlFoto: '',
  vacunasAlDia: false,
  fechaDesparasitacion: '',
  condicionesMedicas: '',
  nombreVeterinario: '',
  telefonoVeterinario: '',
  comportamiento: '',
  observaciones: ''
});

const RegistrarMascota = () => {
  const [mascotas, setMascotas] = useState([nuevaMascota()]);
  const [tabActiva, setTabActiva] = useState(0);

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const nuevasMascotas = [...mascotas];
    nuevasMascotas[index][name] = type === 'checkbox' ? checked : value;
    setMascotas(nuevasMascotas);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleChange(index, {
        target: {
          name: 'urlFoto',
          value: imageUrl,
          type: 'text'
        }
      });
    }
  };

  // Función para eliminar la imagen
    const handleRemoveImage = (index) => {
        const updatedMascotas = [...mascotas];
        updatedMascotas[index].urlFoto = null;  // Elimina la URL de la imagen
        setMascotas(updatedMascotas);
    };

  const agregarMascota = () => {
    setMascotas([...mascotas, nuevaMascota()]);
    setTabActiva(mascotas.length);
  };

  const eliminarMascota = (index) => {
    const nuevasMascotas = mascotas.filter((_, i) => i !== index);
    setMascotas(nuevasMascotas);
    setTabActiva(Math.max(0, index - 1));
  };

  const guardarMascotas = () => {
    console.log('Todas las mascotas registradas:', mascotas);
    alert('Mascotas guardadas en consola');
  };

  return (
    <div className="min-h-screen w-full bg-[url('/assets/fondo.png')] flex flex-col items-center p-4 md:p-8">
      <div className="bg-white bg-opacity-95 p-5 sm:p-6 md:p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Registro de Mascotas</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mascotas.map((_, i) => (
            <div key={i}>
                <button
              
              className={`px-4 py-2 rounded-lg font-semibold ${i === tabActiva ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setTabActiva(i)}
            >
              {mascotas[i].nombre ? mascotas[i].nombre : "Nueva mascota"}
            </button>
            {mascotas.length > 1 && (
                <button
                  type="button"
                  className=" bg-w-full text-red-600 py-2 px-1 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition"
                  onClick={() => eliminarMascota(i)}
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
            onClick={agregarMascota}
          >
            + Agregar otra Mascota
          </button>
        </div>

        {/* Formulario por mascota */}
        {mascotas.map((mascota, index) =>
          index === tabActiva ? (
            <form key={index} className="space-y-4">
                {/* Subida de imagen */}
                {!mascota.urlFoto ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 ">
                    <div className="flex items-center justify-center w-full mb-8">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="hidden"
                        id={`file-upload-${index}`}
                    />
                    <label
                        htmlFor={`file-upload-${index}`}
                        className="cursor-pointer h-52 w-52 object-cover rounded-full bg-gray-200 flex items-center justify-center text-center text-gray-600 border-dashed border-2 border-gray-300"
                    >
                        <span>Haz clic para subir una imagen</span>
                    </label>
                    </div>
                </div>
                
                ) : (
                <div className="flex flex-col my-2 items-center justify-center w-full relative">
                    <img
                    src={mascota.urlFoto}
                    alt={`Mascota ${index + 1}`}
                    className="h-52 w-52 object-cover rounded-full"
                    />
                    {/* Botón de eliminar imagen */}
                    <button
                    onClick={() => handleRemoveImage(index)}
                    className="bg-w-full text-red-600 py-2 px-2 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition"
                    >
                    Eliminar Imagen
                    </button>
                </div>
                )}

              {[
                ['nombre', 'Nombre'],
                ['sexo', 'Sexo'],
              ].map(([name, label]) => (
                <div key={name} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <label htmlFor={name} className="text-gray-700 font-semibold sm:w-40">{label}</label>
                  <input
                    type={name.includes("fecha") ? "date" : "text"}
                    name={name}
                    value={mascota[name]}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}


              {/* Especie Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <label className="text-gray-700 font-semibold sm:w-40">Especie</label>
                <select
                  name="especie"
                  value={mascota.especie}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full bg-gray-100 px-4 py-2 border rounded-lg"
                >
                  {especieOptions.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>

              {/* Raza Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <label className="text-gray-700 font-semibold sm:w-40">Raza</label>
                <select
                  name="raza"
                  value={mascota.raza}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full bg-gray-100 px-4 py-2 border rounded-lg"
                >
                  {razaOptions[mascota.especie || 'Otro'].map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>

                {[
                ['fechaNacimiento', 'Fecha de Nacimiento'],
                ['color', 'Color'],
                ['tamano', 'Tamaño'],
                ['numeroMicrochip', 'Número de Microchip'],
                ['fechaMicrochip', 'Fecha de Microchip'],
                ['fechaDesparasitacion', 'Fecha Desparasitación'],
                ['condicionesMedicas', 'Condiciones Médicas'],
                ['nombreVeterinario', 'Nombre Veterinario'],
                ['telefonoVeterinario', 'Teléfono Veterinario'],
                ['comportamiento', 'Comportamiento'],
                ['observaciones', 'Observaciones']
              ].map(([name, label]) => (
                <div key={name} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <label htmlFor={name} className="text-gray-700 font-semibold sm:w-40">{label}</label>
                  <input
                    type={name.includes("fecha") ? "date" : "text"}
                    name={name}
                    value={mascota[name]}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full bg-gray-100 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}

              

              {/* Checkbox */}
              <div className="flex items-center space-x-2">
                <label className="text-gray-700 font-semibold">Esterilizado</label>
                <input
                  type="checkbox"
                  name="esterilizado"
                  checked={mascota.esterilizado}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-gray-700 font-semibold">Vacunas al Día</label>
                <input
                  type="checkbox"
                  name="vacunasAlDia"
                  checked={mascota.vacunasAlDia}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              
              
            </form>
          ) : null
        )}

        {/* Guardar todas las mascotas */}
        <div className="pt-6">
          <button
            onClick={guardarMascotas}
            className="w-full bg-musgo text-black py-2 rounded-lg font-semibold hover:bg-musgo2 transition duration-200"
          >
            {mascotas.length > 1 ? "Registrar todas las mascotas": "Registrar mascota"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrarMascota;
