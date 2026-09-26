# TRABAJO-FINAL---TUPAD

## Integrantes
- Grupo: 210
- Alumnos: Palacios Agustin; Martinez Juan
- Tutor a cargo: Gerardo Adrian Herrera

## Introducción
El siguiente Trabajo Final de la carrera Tecnicatura Universitaria en Programacion a Distancia consiste en el desarrollo de un sistema de gestión de turnos para una institución de salud, diseñado para facilitar la organización y administración de las citas entre pacientes y profesionales.
Poniendo en practica los conocimeintos y herramientas adquiridos durante la cursada, integrando diferentes conceptos de frontend, backend y base de datos.

### Problematica
En clínicas y centros de salud de escala pequeña o mediana, la gestión de turnos suele resolverse todavía de forma manual: planillas de cálculo, agendas físicas por profesional y coordinación telefónica entre recepción y pacientes. Esta forma de trabajo depende en gran parte del criterio y la disponibilidad del personal administrativo, que debe consultar distintas fuentes de información para saber qué horarios están realmente libres en cada momento.

### Solucion a plantear
Se propone el desarrollo de una aplicación web que centralice la gestión de turnos de la clínica en una única plataforma accesible desde cualquier dispositivo con conexión a internet, eliminando la dependencia de planillas dispersas y comunicación telefónica como única vía de coordinación.



## Estructura del proyecto
```
gestion-turnos/
├── backend/                      # API REST en Node.js + TypeScript
│   ├── prisma/
│   │   └── schema.prisma         # Esquema de base de datos relacional
│   ├── src/
│   │   ├── controllers/          # Controladores
│   │   ├── services/             # Lógica de negocio y reglas de turnos
│   │   ├── routes/               # Rutas y endpoints
│   │   ├── middlewares/          # Manejo de errores
│   │   ├── types/                # Interfaces y tipos TypeScript
│   │   ├── config/               # Configuración de base de datos y variables
│   │   └── index.ts              # Entrada al servidor
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── frontend/                     # Aplicación React + Vite con CSS
│   ├── src/
│   │   ├── assets/               # Imágenes, logos e iconos
│   │   ├── components/           # Componentes reutilizables con sus estilos
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   ├── Calendar/
│   │   │   │   ├── Calendar.jsx
│   │   │   │   └── Calendar.css
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.css
│   │   │   └── ModalTurno/
│   │   │       ├── ModalTurno.jsx
│   │   │       └── ModalTurno.css
│   │   ├── views/                # Vistas principales
│   │   │   ├── Home/
│   │   │   │   ├── Home.jsx
│   │   │   │   └── Home.css
│   │   │   ├── ReservaTurno/
│   │   │   │   ├── ReservaTurno.jsx
│   │   │   │   └── ReservaTurno.css
│   │   │   ├── PanelMedico/
│   │   │   └── Login/
│   │   ├── services/             # Peticiones HTTP a la API
│   │   ├── styles/               # Estilos globales y diseño del sistema
│   │   │   ├── variables.css     # Colores de la clínica, fuentes, espaciados
│   │   │   ├── reset.css         # Reseteo de márgenes y box-sizing
│   │   │   └── global.css        # Tipografías base y estilos comunes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
├── database/                     # Scripts y documentación
│   ├── ddl/
│   │   └── 01_create_tables.sql  # Creación de tablas, claves foráneas e índices
│   └── dml/
│       └── 02_initial_seeds.sql  # Inserción de especialidades, admin y roles
│
├── docs/                         # Informes y documentación
│
├── .gitignore
└── README.md                     # Documentación principal del repositorio
```


## Tecnologias a utilizar

- Frontend: Javascript/Typescript, React, HTML y CSS
- Backend: Typescript
- Base de datos: MySQL
- Despliegue del frontend: Vercel
- Despliegue del backend: Railway

El stack tecnologico propuesto son herramientas vistas durante la cursada de la carrera, pero como equipo tambien contemplamos la posibilidad de ajustar alguna tecnologia sobre la marcha si surge alguna necesitad en concreto.

## Desarrollo por Etapas

### Etapa 1: Núcleo Operativo, Autenticación y Reserva Online 

* **Módulo de Autenticación y Seguridad (Auth):**
  * Registro de pacientes y acceso mediante credenciales (email y contraseña).
  * Control de acceso basado en roles para perfiles: `PACIENTE`, `MEDICO` y `ADMIN`.
  * Protección de rutas y persistencia de sesión en el frontend con `AuthContext` y `ProtectedRoute`.

* **Módulo de Pacientes (Autogestión):**
  * Búsqueda parametrizada cruzando especialidad, profesional, fecha y cobertura médica habilitada.
  * Selección y reserva de franjas horarias libres calculadas en tiempo real.
  * Panel "Mis Turnos": consulta de citas agendadas e historial, cancelación autónoma con liberación inmediata de cupo.
 

* **Módulo de Profesionales Médicos:**
  * Visualización de agenda de turnos agendados.
  * Configuración de rutina horaria semanal: definición de días laborales, horarios de atención y duración estándar por consulta (ej. 15, 30, 45 min).

* **Módulo de Excepciones y Bloqueos de Agenda:**
  * Registro y gestión de ausencias programadas o imprevistas (licencias, feriados, vacaciones).
  * Exclusión automática de franjas horarias bloqueadas en el motor de búsqueda y reserva.

* **Módulo de Obras Sociales y Coberturas:**
  * Catálogo centralizado de obras sociales, prepagas y modalidad Particular.


* **Módulo de Administración y Mesa de Entrada:**
  * ABM (CRUD) integral de médicos, especialidades, consultorios físicos y coberturas.
  * Mesa de entrada: búsqueda de pacientes por DNI y asignación de turnos presenciales o telefónicos.
  * Panel básico con métricas de ocupación y turnos asignados por especialidad.

---

### Etapa 2: Recordatorios, Notificaciones y Optimización Operativa 

* **Sistema de Recordatorios y Notificaciones:**
  * Envío programado de alertas previas al turno por correo electrónico.
  * Notificaciones de cancelación o reprogramación de turnos emitidas al instante para el paciente o el médico.


---

### Etapa 3: Chatbot y Canales Conversacionales 

* **Chatbot Asistencial para Pacientes:**
  * Asistente virtual interactivo integrado en el frontend (widget web) para resolver dudas frecuentes sobre horarios de atención, especialidades y requisitos de coberturas.
  * Consulta guiada de disponibilidad de turnos en lenguaje natural con derivación al flujo de reserva.

## Documentación

La documentacion se encuentra disponible en docs/