 # Especificación Técnica y Funcional del Sistema:


## 1. Introducción y Alcance del Sistema

**La aplicación** es una plataforma web integral orientada a la centralización, automatización y digitalización de la reserva y administración de turnos médicos en consultorios ambulatorios y centros de salud zonales.

El sistema vincula de manera coordinada a tres actores principales:
* **Pacientes:** Autogestión de citas según especialidad y obra social, consulta de turnos activos, cancelación autónoma y descarga de comprobantes.
* **Profesionales Médicos:** Administración de agendas asistenciales, parametrización de horarios de atención y registro de licencias/bloqueos temporales.
* **Personal Administrativo y Recepción:** Gestión integral de catálogos maestros (médicos, consultorios físicos, especialidades y coberturas), asignación de turnos presenciales/telefónicos vía mesa de entrada y supervisión operativa.


## 2. Requerimientos del Sistema

### 2.1. Requerimientos Funcionales

| Código | Requerimiento | Descripción Detallada |
| :--- | :--- | :--- |
| **RF-01** | Registro de Pacientes | El sistema debe permitir el autoregistro de pacientes ingresando nombre, apellido, DNI, teléfono, obra social/prepaga y credenciales (email y contraseña). |
| **RF-02** | Autenticación y Autorización | Inicio de sesión unificado con emisión de token JWT firmado que encapsule el identificador y rol (`PACIENTE`, `MEDICO`, `ADMIN`). |
| **RF-03** | Protección y Persistencia | El frontend debe gestionar la persistencia de la sesión mediante `AuthContext` y denegar el acceso a rutas protegidas (`ProtectedRoute`) según el rol del usuario. |
| **RF-04** | Catálogo de Coberturas y Especialidades | Exposición pública de listados de obras sociales, prepagas y especialidades para la parametrización de filtros de búsqueda. |
| **RF-05** | Búsqueda Parametrizada de Turnos | Filtro combinando especialidad médica, profesional, cobertura aceptada y rango de fechas. |
| **RF-06** | Cálculo de Disponibilidad | El motor de turnos debe calcular en tiempo real los turnos disponibles, descontando turnos ocupados. |
| **RF-07** | Reserva Efectiva de Cita | Confirmación de reserva por parte del paciente o personal administrativo, persistiendo la cita y la unicidad de la misma. |
| **RF-08** | Cancelación de Turnos | Pacientes y administradores deben poder cancelar turnos activos, liberando de forma inmediata la franja horaria correspondiente. |
| **RF-09** | Visualización de Agenda Médica | El médico debe poder consultar su agenda diaria y semanal en formato de grilla cronológica. |
| **RF-10** | Configuración de Rutina Horaria | El profesional o administrador debe poder parametrizar los días laborales, horarios de inicio/fin y la duración estándar de la consulta (ej. 15, 30, 45 min). |
| **RF-11** | Registro de Bloqueos y Licencias | Declaración de períodos de indisponibilidad temporal (vacaciones, licencias médicas, congresos, feriados) que inhabiliten la oferta de turnos. |
| **RF-12** | Matriz Médico-Cobertura | Vinculación de profesionales con las obras sociales que reciben, permitiendo definir aranceles o copagos diferenciales. |
| **RF-13** | Mesa de Entrada Presencial | Registro e imputación rápida de turnos para pacientes presenciales o telefónicos mediante la búsqueda por DNI. |
| **RF-14** | ABM de Profesionales y Consultorios | Alta, baja lógica y modificación de médicos y consultorios físicos como entidades independientes; asignación de matrícula y vinculación de médicos con uno o más consultorios. Un consultorio inactivo no puede recibir nuevos turnos. |
| **RF-15** | Notificación por Correo Electrónico | Envío de un email de confirmación con el resumen de la cita tras una reserva exitosa. |
| **RF-16** | Historial y Auditoría de Turnos | Registrar cada alta y cambio de un turno con fecha, actor, origen, motivo y valores anteriores/nuevos para reconstruir su evolución. |
| **RF-17** | Ciclo de Vida del Turno | Gestionar los estados `CONFIRMADO`, `CANCELADO`, `REPROGRAMADO`, `AUSENTE` y `ATENDIDO`, aplicando transiciones permitidas y conservando los registros históricos. |
| **RF-18** | Auditoría Administrativa | Registrar las altas, modificaciones, bajas lógicas y asignaciones administrativas con actor, entidad afectada, fecha, origen y valores anteriores/nuevos. |

---

### 2.2. Requerimientos No Funcionales

| Código | Categoría | Especificación |
| :--- | :--- | :--- |
| **RNF-01** | **Seguridad Criptográfica** | Las contraseñas se almacenarán en MySQL protegidas mediante la función hash **bcrypt**. |
| **RNF-02** | **Seguridad en API** | Todos los endpoints privados validarán la presencia del token JWT en la cabecera `Authorization: Bearer <token>`. |
| **RNF-03** | **Integridad Transaccional** | MySQL y transacciones atómicas para reservar, cancelar y reprogramar turnos; la validación de disponibilidad y la escritura deben pertenecer a la misma transacción. |
| **RNF-04** | **Eficiencia y Latencia** | El cálculo de disponibilidad semanal no debe exceder los 800 ms de procesamiento bajo condiciones estándar de red. |
| **RNF-05** | **Arquitectura de Software** | Backend modular desacoplado en capas lógicas (Rutas, Controladores, Servicios y ORM Prisma), fuertemente tipado mediante **TypeScript**. |
| **RNF-06** | **Interfaz de Usuario** | Frontend desarrollado sobre React 18 con Vite. Los estilos se gestionarán exclusivamente mediante **CSS puro** (variables CSS institucionales, reset, clases utilitarias y hojas de estilo por componente complejo), con diseño adaptable (*responsive design*). |
| **RNF-07** | **Compatibilidad Cloud** | Estructuración orientada a despliegues PaaS gratuitos (Vercel para frontend, Render/Railway para backend Node.js, y MySQL en Aiven, Clever Cloud o Railway). |

---

## 3. Reglas de Negocio (RN)

* **RN-01 (Anticolisión de Recursos):** No puede haber turnos confirmados con intervalos superpuestos para el mismo médico ni para el mismo consultorio. La reserva bloquea ambos recursos en orden estable, valida el solapamiento y persiste el turno en una única transacción. Los índices ordinarios ayudan a consultar, pero no sustituyen el bloqueo transaccional para intervalos de distinta duración.
* **RN-02 (Prioridad de Bloqueos sobre Disponibilidad):** Los períodos registrados en `bloqueos_agenda` anulan cualquier horario disponible configurado en la rutina semanal del médico para ese lapso de tiempo.
* **RN-03 (Compatibilidad de Cobertura):** Un paciente solo puede reservar bajo la cobertura de una obra social/prepaga si el profesional seleccionado tiene un convenio activo registrado en `medicos_coberturas`. De no haber coincidencia, la cita solo podrá reservarse bajo arancel "Particular".
* **RN-04 (Anticipación Mínima de Reserva):** Toda reserva efectuada por autogestión de pacientes debe realizarse con un mínimo de 2 horas de anticipación al horario de atención solicitado.
* **RN-05 (Ventana Límite de Cancelación Web):** La cancelación autónoma de turnos desde el panel del paciente está habilitada hasta 4 horas antes del turno. Pasada dicha ventana temporal, el paciente deberá solicitar la anulación vía Administración.
* **RN-06 (Límite Concurrente de Citas Activas):** Un paciente no puede mantener más de 1 turno simultáneo en estado activo para una misma especialidad médica.
* **RN-07 (Trazabilidad y Cancelación Lógica):** Las anulaciones cambian el estado a `CANCELADO`, liberan el recurso dentro de la misma transacción y conservan el turno. Cada operación administrativa o clínica relevante genera un evento de auditoría; no se eliminan físicamente turnos ni eventos.
* **RN-08 (Transiciones de Estado):** `CONFIRMADO` puede pasar a `CANCELADO`, `REPROGRAMADO`, `AUSENTE` o `ATENDIDO`, según permisos y momento operativo. `REPROGRAMADO` identifica el turno anterior y se crea un nuevo turno confirmado en la misma transacción. Los estados terminales no vuelven a `CONFIRMADO`; para corregirlos se registra una nueva operación auditable.
* **RN-09 (Ocupación de Turnos):** Solo `CONFIRMADO` ocupa disponibilidad futura. `CANCELADO` y `REPROGRAMADO` liberan el horario; `ATENDIDO` y `AUSENTE` son resultados de turnos cuya franja ya transcurrió. La regla se aplica igual a la agenda del médico y a la del consultorio.
* **RN-10 (Formato de Horarios):** Los horarios se almacenan como minutos desde medianoche, entre 0 y 1439. El fin debe ser mayor que el inicio y la duración debe ser múltiplo de la unidad operativa definida. La API puede recibir y devolver `HH:mm`.
* **RN-11 (Auditoría Administrativa):** Las operaciones de administración sobre médicos, consultorios, especialidades, coberturas y asignaciones registran actor, acción y datos afectados. Los eventos no se editan ni eliminan; los snapshots excluyen credenciales, tokens y otros secretos.

---

## 4. Definición Funcional de Módulos

### 4.1. Módulo de Autenticación y Autorización
* **Propósito:** Control de identidad y privilegios del sistema.
* **Componentes Backend:** `auth.controller.ts`, `auth.service.ts`, `auth.middleware.ts`.
* **Componentes Frontend:** `AuthContext.jsx`, `ProtectedRoute.jsx`, `views/Login/Login.jsx`.
* **Funcionalidad:** Cifrado, validación de credenciales, generación de JWT y filtrado de rutas protegidas según rol (`PACIENTE`, `MEDICO`, `ADMIN`).

### 4.2. Módulo de Pacientes y Autogestión
* **Propósito:** Acceso del paciente a búsqueda, reserva y gestión de sus citas médicas.
* **Componentes Backend:** `turno.controller.ts`, `turno.service.ts`.
* **Componentes Frontend:** `views/ReservaTurno/ReservaTurno.jsx`, `views/MisTurnos/MisTurnos.jsx`, `components/Calendar/Calendar.jsx`, `components/ModalTurno/ModalTurno.jsx`.
* **Funcionalidad:** Búsqueda filtrada por especialidad y cobertura. Selección de horarios disponibles. Listado personal de citas activas y pasadas con opción de cancelación y generación de comprobante en PDF.

### 4.3. Módulo de Profesionales Médicos
* **Propósito:** Organización y consulta de la agenda médica.
* **Componentes Backend:** `medico.controller.ts`, `medico.service.ts`.
* **Componentes Frontend:** `views/PanelMedico/PanelMedico.jsx`.
* **Funcionalidad:** Visualización de la agenda diaria y semanal, con estado operativo y consultorio asignado.

### 4.4. Módulo de Excepciones y Bloqueos de Agenda
* **Propósito:** Gestionar la indisponibilidad horaria por motivos extraordinarios (licencias, feriados, vacaciones, etc.).
* **Componentes Backend:** `bloqueo.controller.ts`, `bloqueo.service.ts`, `bloqueo.routes.ts`.
* **Funcionalidad:** Alta y consulta de bloqueos temporales por rango de fecha/hora. Descuento automático de estos intervalos durante el cálculo de disponibilidad de turnos.

### 4.5. Módulo de Obras Sociales y Coberturas
* **Propósito:** Administrar el padrón de mutuales y su vinculación personalizada con los especialistas.
* **Componentes Backend:** `cobertura.controller.ts`, `cobertura.service.ts`, `cobertura.routes.ts`.
* **Funcionalidad:** CRUD de coberturas y asignación a médicos mediante la entidad intermedia `medicos_coberturas`, soportando valores de arancel o copago.

### 4.6. Módulo de Administración y Mesa de Entrada
* **Propósito:** Operación de la gestión administrativa del sistema.
* **Componentes Backend:** Endpoints administrativos con verificación de rol `ADMIN`.
* **Componentes Frontend:** `views/Admin/AdminDashboard.jsx`.
* **Funcionalidad:** ABM de médicos, especialidades y consultorios; asignación de médicos a consultorios. Mesa de entrada con buscador por DNI y registro del actor/origen de la operación. Métricas básicas por especialidad, consultorio y estado.


## 5. Modelo de datos objetivo (`backend/prisma/schema.prisma`)

> Este modelo documenta el diseño esperado; no implica que el backend o las migraciones estén implementados. La migración de datos existentes se detalla en `docs/plan_correcciones.md`.

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Rol {
  ADMIN
  MEDICO
  PACIENTE
}

enum EstadoTurno {
  CONFIRMADO
  CANCELADO
  REPROGRAMADO
  AUSENTE
  ATENDIDO
}

enum AccionHistorialTurno {
  ALTA
  CANCELACION
  REPROGRAMACION
  CAMBIO_ESTADO
  MODIFICACION
}

enum AccionAuditoria {
  ALTA
  MODIFICACION
  BAJA_LOGICA
  ASIGNACION
  DESASIGNACION
}

model Usuario {
  id        Int       @id @default(autoincrement())
  email     String    @unique @db.VarChar(150)
  password  String    @db.VarChar(255)
  rol       Rol       @default(PACIENTE)
  activo    Boolean   @default(true)
  creadoEn  DateTime  @default(now()) @map("creado_en")

  paciente  Paciente?
  medico    Medico?
  eventosTurno HistorialTurno[] @relation("ActorHistorialTurno")
  eventosAdmin AuditoriaOperacion[] @relation("ActorAuditoria")

  @@map("usuarios")
}

model Cobertura {
  id               Int               @id @default(autoincrement())
  nombre           String            @unique @db.VarChar(100)
  pacientes        Paciente[]
  medicosAtendidos MedicoCobertura[]
  turnos           Turno[]

  @@map("coberturas")
}

model Paciente {
  id          Int        @id @default(autoincrement())
  usuarioId   Int        @unique @map("usuario_id")
  nombre      String     @db.VarChar(100)
  apellido    String     @db.VarChar(100)
  dni         String     @unique @db.VarChar(20)
  telefono    String?    @db.VarChar(30)
  coberturaId Int?       @map("cobertura_id")
  nroAfiliado String?    @map("nro_afiliado") @db.VarChar(50)

  usuario     Usuario    @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  cobertura   Cobertura? @relation(fields: [coberturaId], references: [id])
  turnos      Turno[]

  @@map("pacientes")
}

model Especialidad {
  id          Int      @id @default(autoincrement())
  nombre      String   @unique @db.VarChar(100)
  descripcion String?  @db.Text
  medicos     Medico[]

  @@map("especialidades")
}

model Medico {
  id             Int               @id @default(autoincrement())
  usuarioId      Int               @unique @map("usuario_id")
  nombre         String            @db.VarChar(100)
  apellido       String            @db.VarChar(100)
  matricula      String            @unique @db.VarChar(50)
  especialidadId Int               @map("especialidad_id")
  usuario        Usuario           @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  especialidad   Especialidad      @relation(fields: [especialidadId], references: [id])
  consultorios   MedicoConsultorio[]
  coberturas     MedicoCobertura[]
  horarios       HorarioAtencion[]
  bloqueos       BloqueoAgenda[]
  turnos         Turno[]

  @@map("medicos")
}

model Consultorio {
  id        Int       @id @default(autoincrement())
  codigo    String    @unique @db.VarChar(30)
  nombre    String    @db.VarChar(100)
  ubicacion String?   @db.VarChar(150)
  activo    Boolean   @default(true)
  creadoEn  DateTime  @default(now()) @map("creado_en")

  medicos   MedicoConsultorio[]
  turnos    Turno[]

  @@map("consultorios")
}

model MedicoConsultorio {
  medicoId      Int         @map("medico_id")
  consultorioId Int         @map("consultorio_id")
  activo        Boolean     @default(true)
  asignadoEn    DateTime    @default(now()) @map("asignado_en")

  medico        Medico      @relation(fields: [medicoId], references: [id], onDelete: Cascade)
  consultorio   Consultorio @relation(fields: [consultorioId], references: [id], onDelete: Restrict)

  @@id([medicoId, consultorioId])
  @@map("medicos_consultorios")
}

model MedicoCobertura {
  medicoId      Int      @map("medico_id")
  coberturaId   Int      @map("cobertura_id")
  arancelCopago Decimal? @default(0.00) @map("arancel_copago") @db.Decimal(10, 2)

  medico        Medico    @relation(fields: [medicoId], references: [id], onDelete: Cascade)
  cobertura     Cobertura @relation(fields: [coberturaId], references: [id], onDelete: Cascade)

  @@id([medicoId, coberturaId])
  @@map("medicos_coberturas")
}

model HorarioAtencion {
  id                   Int      @id @default(autoincrement())
  medicoId             Int      @map("medico_id")
  diaSemana            Int      @map("dia_semana") // 1=Lunes ... 6=Sábado
  horaDesdeMinutos     Int      @map("hora_desde_minutos") // Minutos desde medianoche
  horaHastaMinutos     Int      @map("hora_hasta_minutos")
  duracionTurnoMinutos Int      @default(30) @map("duracion_turno_minutos")

  medico               Medico   @relation(fields: [medicoId], references: [id], onDelete: Cascade)

  @@map("horarios_atencion")
}

model BloqueoAgenda {
  id         Int      @id @default(autoincrement())
  medicoId   Int      @map("medico_id")
  fechaDesde DateTime @map("fecha_desde")
  fechaHasta DateTime @map("fecha_hasta")
  motivo     String?  @db.VarChar(255)
  creadoEn   DateTime @default(now()) @map("creado_en")

  medico     Medico   @relation(fields: [medicoId], references: [id], onDelete: Cascade)

  @@map("bloqueos_agenda")
}

model Turno {
  id             Int         @id @default(autoincrement())
  pacienteId     Int         @map("paciente_id")
  medicoId       Int         @map("medico_id")
  consultorioId  Int         @map("consultorio_id")
  coberturaId    Int?        @map("cobertura_id")
  fecha          DateTime    @db.Date
  horaInicioMinutos Int      @map("hora_inicio_minutos")
  horaFinMinutos    Int      @map("hora_fin_minutos")
  estado         EstadoTurno @default(CONFIRMADO)
  motivoConsulta String?     @map("motivo_consulta") @db.VarChar(255)
  creadoEn       DateTime    @default(now()) @map("creado_en")
  turnoAnteriorId Int?       @unique @map("turno_anterior_id")

  paciente       Paciente    @relation(fields: [pacienteId], references: [id])
  medico         Medico      @relation(fields: [medicoId], references: [id])
  consultorio    Consultorio @relation(fields: [consultorioId], references: [id], onDelete: Restrict)
  cobertura      Cobertura?  @relation(fields: [coberturaId], references: [id])
  turnoAnterior  Turno?      @relation("Reprogramacion", fields: [turnoAnteriorId], references: [id], onDelete: SetNull)
  turnoSiguiente Turno?      @relation("Reprogramacion")
  historial      HistorialTurno[]

  @@index([medicoId, fecha, horaInicioMinutos])
  @@index([consultorioId, fecha, horaInicioMinutos])
  @@map("turnos")
}

model AuditoriaOperacion {
  id                Int              @id @default(autoincrement())
  actorUsuarioId    Int?             @map("actor_usuario_id")
  entidad           String           @db.VarChar(60)
  entidadId         String           @map("entidad_id") @db.VarChar(60)
  accion            AccionAuditoria
  valoresAnteriores Json?            @map("valores_anteriores")
  valoresNuevos     Json?            @map("valores_nuevos")
  origen            String?          @db.VarChar(30)
  motivo            String?          @db.VarChar(255)
  creadoEn          DateTime         @default(now()) @map("creado_en")

  actor             Usuario?         @relation("ActorAuditoria", fields: [actorUsuarioId], references: [id], onDelete: SetNull)

  @@index([entidad, entidadId, creadoEn])
  @@index([actorUsuarioId, creadoEn])
  @@map("auditoria_operaciones")
}

model HistorialTurno {
  id                Int                   @id @default(autoincrement())
  turnoId           Int                   @map("turno_id")
  actorUsuarioId    Int?                  @map("actor_usuario_id")
  accion            AccionHistorialTurno
  estadoAnterior    EstadoTurno?          @map("estado_anterior")
  estadoNuevo       EstadoTurno?          @map("estado_nuevo")
  valoresAnteriores Json?                 @map("valores_anteriores")
  valoresNuevos     Json?                 @map("valores_nuevos")
  origen            String?               @db.VarChar(30)
  motivo            String?               @db.VarChar(255)
  creadoEn          DateTime              @default(now()) @map("creado_en")

  turno             Turno                 @relation(fields: [turnoId], references: [id], onDelete: Restrict)
  actor             Usuario?              @relation("ActorHistorialTurno", fields: [actorUsuarioId], references: [id], onDelete: SetNull)

  @@index([turnoId, creadoEn])
  @@index([actorUsuarioId, creadoEn])
  @@map("historial_turnos")
}
```

## 6. Casos de Uso, Historias de Usuario y DER

Los escenarios funcionales, actores, flujos alternativos e historias con criterios de aceptación se detallan en [Casos de Uso e Historias de Usuario](casos_uso_historias_usuario.md). El diagrama entidad-relación formal con claves y cardinalidades está disponible en [DER](diagramas/der.md); el [diagrama de clases](diagramas/diagrama.md) y los [flujos críticos](diagramas/flujos_criticos.md) complementan esa vista.

Estos artefactos describen el modelo objetivo y no implican que el backend o la base de datos ya estén implementados.