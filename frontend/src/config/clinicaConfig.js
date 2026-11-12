/**
 * Archivo de Configuración Institucional
 * Permite adaptar todo el sistema a cualquier clínica, policonsultorio o
 * centro médico sin modificar el código de los componentes React.
 */

export const clinicaConfig = {
  // Identidad institucional
  nombre: "Centro Médico Privado",
  nombreCorto: "CMP",
  slogan: "Tu salud, sin filas ni esperas.",
  subtitulo: "Reservá tu turno médico online las 24 hs de forma simple.",

  // Logotipo e isotipo (icono SVG o ruta a imagen)
  logo: {
    tipo: "icon", // 'icon' o 'image'
    iconText: "+",
    imageSrc: "/assets/logo.png"
  },

  // Canales de contacto y ubicación
  contacto: {
    direccion: "Av. Siempre Viva 123",
    ciudad: "Centro Cívico, Buenos Aires",
    telefonoPrincipal: "0800-555-0199",
    telefonoGuardia: "(011) 4890-7000",
    email: "consultas@clinicasancamilo.com.ar",
    googleMapsUrl: "https://maps.google.com/?q=Av.+Siempre+Viva+123",
    horarios: {
      semana: "Lunes a Viernes: 07:30 a 20:30 hs",
      sabado: "Sábados: 08:00 a 13:00 hs",
      guardia: "Guardia Médica 24 hs"
    }
  },

  // Textos y botones de conversión en el Hero
  hero: {
    titulo: "Tu salud, sin filas ni esperas.",
    subtitulo: "Reservá tu turno médico online las 24 hs de forma simple, rápida y transparente.",
    btnPrimary: "Reservar Turno Ahora",
    btnSecondary: "Consultar Mis Turnos"
  },

  // Pasos de la guía rápida "¿Cómo funciona?"
  comoFunciona: [
    {
      paso: "1",
      titulo: "Elegí especialidad",
      descripcion: "Seleccioná el área médica o el profesional de tu preferencia.",
      icon: "stethoscope"
    },
    {
      paso: "2",
      titulo: "Seleccioná horario",
      descripcion: "Elegí el día y la hora disponible que mejor se adapte a tu agenda.",
      icon: "calendar"
    },
    {
      paso: "3",
      titulo: "¡Listo! Confirmá",
      descripcion: "Ingresá tus datos, confirmá tu cita y descargá tu comprobante.",
      icon: "check"
    }
  ],

  // Parámetros de atención particular 
  atencionParticular: {
    habilitada: true,
    etiqueta: "Particular (Sin Cobertura)",
    descripcion: "Atención accesible para pacientes sin obra social o con planes sin convenio directo.",
    badgeTexto: "Atención Universal"
  }
};

export default clinicaConfig;

