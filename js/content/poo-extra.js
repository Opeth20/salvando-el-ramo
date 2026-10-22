// Guía de Javi por unidad, misiones para hacer en un IDE real y el plan hacia la prueba.
//
// coach:  { focus, exam: [tips para la prueba] }
// mision: { title, intro, steps: [md], files: [{ name, code, lang }], expect: [string | RegExp] | 'json', note }
//   expect: líneas que deben aparecer (en orden) en la consola que pega el estudiante.

export const EXAM = {
  date: '2026-11-04',
  title: 'Prueba POO',
  scope: 'Material 1.x y 2.x',
  units: 11, // unidades 1–11 entran en la prueba; la 12 (3.x) es para después
};

// Archivos oficiales de la plataforma → [unidad, nivel] (índices desde 1; nivel omitido = toda la unidad)
export const MATERIAL = [
  { file: '1 · Primeros pasos con Java', refs: [[1]] },
  { file: '1.1.1 · Paradigma POO', refs: [[2, 1], [2, 2], [4, 4]] },
  { file: '1.2.1 · Métodos', refs: [[3]] },
  { file: '1.2.2 · Clases y abstracción', refs: [[2, 1], [4, 1]] },
  { file: '1.2.3 · Encapsulamiento', refs: [[4, 1], [4, 2], [4, 3]] },
  { file: '1.2.4 · Guía: de Python a Java', refs: [[2, 3]] },
  { file: '1.2.5 · Ejercicios generales', refs: [[2, 3], [4, 1], [4, 2]] },
  { file: '1.3.1 · Comunicación entre clases', refs: [[5]] },
  { file: '2.1.1 · Introducción a Maven', refs: [[9, 1]] },
  { file: '2.1.2 · Configuración JavaFX', refs: [[9, 1], [9, 2]] },
  { file: '2.1.3 · Escenas y ciclo de vida', refs: [[9, 2], [9, 3]] },
  { file: '2.1.4 · Guía: proyecto JavaFX + Maven', refs: [[9]] },
  { file: '2.1.5 · Ejercicios: ventana FXML', refs: [[9, 4]] },
  { file: '2.2.1 · Herencia y polimorfismo', refs: [[6], [7]] },
  { file: '2.3.1 · Patrón MVC en JavaFX', refs: [[10, 1], [10, 4]] },
  { file: '2.3.2 · TableView y ObservableList', refs: [[10, 2]] },
  { file: '2.3.3 · Navegación entre vistas', refs: [[10, 3], [10, 5]] },
  { file: '2.3.4 · Validación de formularios', refs: [[10, 3]] },
  { file: '2.3.5 / 2.3.6 · Guía y ejercicios MVC', refs: [[10]] },
  { file: '2.4.1 · Persistencia con JSON', refs: [[11, 1], [11, 4]] },
  { file: '2.4.2 · Capa Repository y DAO', refs: [[11, 2], [11, 3]] },
  { file: '2.4.3 / 2.4.4 · Guía y ejercicios persistencia', refs: [[11]] },
  { file: 'Resumen_Prueba · tu Prueba 1 (método completo)', refs: [['prueba1'], [7, 3], [8]] },
];

export const COACH = [
  /* 1 */ {
    focus: 'Calienta motores: **main**, tipos de datos, **Scanner** y if/switch/for. Es la base de todo lo que viene.',
    exam: ['`public static void main(String[] args)` de memoria.', 'No existe `nextChar()`: usa `sc.next().charAt(0)`.', 'Sin `break`, el switch sigue al siguiente case.'],
  },
  /* 2 */ {
    focus: 'Aquí empieza POO de verdad: **clase = molde**, **objeto = instancia**, y el **constructor** con `this`.',
    exam: ['El constructor se llama igual que la clase y NO lleva `void`.', 'Sin `this.nombre = nombre` el atributo queda en null.', 'Traducir de Python: `__init__` → constructor, `self` → `this`.'],
  },
  /* 3 */ {
    focus: 'Métodos: cuándo **retornar** vs **imprimir**, parámetros, `static` y **sobrecarga**.',
    exam: ['Si no es void, todos los caminos terminan en `return`.', 'Desde `main` (static) no llamas métodos de instancia sin crear un objeto.', 'Sobrecarga = mismo nombre, distintos parámetros.'],
  },
  /* 4 */ {
    focus: 'Encapsulamiento: atributos `private`, getters/setters y **validaciones con excepciones**. También leer **diagramas UML**.',
    exam: ['El constructor llama a los setters (así no se salta la validación).', '`throw new IllegalArgumentException("mensaje")` dentro del setter.', 'UML: `-` private, `+` public, `#` protected; el tipo va después de `:`.'],
  },
  /* 5 */ {
    focus: 'Clases que **trabajan juntas**: un objeto como atributo de otro. Es el formato del ejercicio tipo prueba (Bencinera).',
    exam: ['"Tiene un" → atributo del otro tipo: `private Persona propietario;`', 'Calcula y retorna; imprime en el main.', 'Valida datos (vacíos, ≤ 0) y prueba los escenarios del enunciado.'],
  },
  /* 6 */ {
    focus: 'Herencia y polimorfismo: `extends`, `super(...)`, `@Override` y guardar hijos en variables del padre.',
    exam: ['`super(...)` SIEMPRE es la primera línea del constructor hijo.', '`private` del padre no se ve en el hijo: usa `protected` o getters.', 'Sobrescritura (misma firma) ≠ sobrecarga (otros parámetros).'],
  },
  /* 7 */ {
    focus: 'El **molde de la prueba**: clase padre `abstract`, hijas con `calcular...()`, e **interfaz** como contrato.',
    exam: ['Orden: ① interfaz → ② padre → ③ hijas → ④ gestor → ⑤ main.', 'Los String se comparan con `.equals()`, nunca con `==`.', '`implements` solo en la hija que lo pida el enunciado.'],
  },
  /* 8 */ {
    focus: '`ArrayList` y la clase **Gestor**: registrar, buscar, listar y mostrar costos. Con esto cierras el molde completo.',
    exam: ['"No se encontró" va DESPUÉS del for, no en un else.', 'Buscar por int: `==` · por String: `.equals()`.', 'En el main prueba una clave que existe y otra que no.'],
  },
  /* 9 */ {
    focus: 'Pasamos a ventanas: **Maven** (pom.xml), **JavaFX** (Stage → Scene → nodos), el ciclo de vida y la vista en **FXML**.',
    exam: ['Clases en `src/main/java`, FXML/CSS en `src/main/resources`.', '`init()` → `start()` → `stop()`.', 'Sin `setScene(scene)` la ventana sale vacía.'],
  },
  /* 10 */ {
    focus: '**MVC**: la vista (FXML) no tiene lógica, el controlador coordina y el modelo guarda datos. TableView + ObservableList + validación + navegación.',
    exam: ['`fx:id` = nombre del atributo `@FXML`; `onAction="#metodo"` = nombre del método.', '`PropertyValueFactory<>("nombre")` busca `getNombre()`.', 'Valida con `trim()`, `isEmpty()`, `contains("@")` y `try/catch` de `parseInt`.'],
  },
  /* 11 */ {
    focus: 'Persistencia: guardar y cargar con **Jackson** (`ObjectMapper`), separando **DAO** (archivo) y **Repository** (lista de la app).',
    exam: ['El modelo necesita constructor vacío + getters/setters.', 'DAO = ¿cómo leo/escribo? · Repository = ¿cómo usa la app los datos?', 'Archivo inexistente/vacío o cancelado → no te caigas: lista vacía o `return`.'],
  },
  /* 12 */ {
    focus: 'Base de datos con **JDBC**: conexión, consultas y **PreparedStatement**. Es materia 3.x: después del 4 de noviembre.',
    exam: ['Los `?` se numeran desde 1.', '`executeQuery` para SELECT, `executeUpdate` para INSERT/UPDATE/DELETE.', 'Nunca concatenes datos del usuario en el SQL.'],
  },
];

const IDE_START = 'Abre **IntelliJ IDEA** (o NetBeans) → **New Project** → **Java** → ponle el nombre indicado → Create.';

export const MISSIONS = [
  /* 1 */ {
    title: 'Registro de usuario con Scanner',
    intro: 'El ejercicio 1–3 de la clase "Primeros pasos": un programa que pide datos y decide con if y switch.',
    steps: [
      IDE_START + ' Nombre: `RegistroUsuario`.',
      'Crea la clase `Main`, pega el código y completa cada `TODO`.',
      'Ejecuta (▶) e ingresa: `Ana`, `20`, `1,65`, `true`, `S`. **Ojo:** en un Windows en español `nextDouble()` exige **coma** (`1,65`); con punto lanza *InputMismatchException*. Igual se imprime `1.65` con punto.',
      'Copia **toda la consola** y pégala abajo para validar.',
    ],
    files: [{
      name: 'Main.java',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Nombre:");
        String nombre = sc.nextLine();
        System.out.println("Edad:");
        // TODO: lee la edad (int)
        System.out.println("Estatura:");
        // TODO: lee la estatura (double)
        System.out.println("¿Trabaja? (true/false):");
        // TODO: lee si trabaja (boolean)
        System.out.println("Estado civil (S/C/V/D):");
        // TODO: lee el estado civil (char) con sc.next().charAt(0)

        // TODO: if simple → si trabaja imprime "Trabajador/a"
        // TODO: if-else → imprime "Mayor de edad" o "Menor de edad"
        // TODO: switch → S: "Soltero/a", C: "Casado/a", V: "Viudo/a", D: "Divorciado/a"
        // TODO: imprime "Resumen: " + nombre + ", " + edad + " años, " + estatura + " m"
    }
}`,
    }],
    expect: ['Trabajador/a', 'Mayor de edad', 'Soltero/a', 'Resumen: Ana, 20 años, 1.65 m'],
  },
  /* 2 */ {
    title: 'La clase Mascota y sus constructores',
    intro: 'Tú escribes la clase; el main ya está listo para probarla.',
    steps: [
      IDE_START + ' Nombre: `Mascotas`.',
      'Crea la clase `Mascota` con atributos **privados** `nombre`, `especie` (String) y `peso` (double).',
      'Tres constructores: (nombre, especie, peso) · (nombre, especie) → peso 0.0 · sin parámetros → `"Doge"`, `"perro"`, `8.0`.',
      'Método `setPeso(double peso)` y método `presentarse()` que imprima `Soy <nombre>, un <especie> de <peso> kg`.',
      'Crea `Main` con el código de abajo, ejecútalo y pega la consola.',
    ],
    files: [{
      name: 'Main.java',
      code: `public class Main {
    public static void main(String[] args) {
        Mascota m1 = new Mascota("Firulais", "perro", 12.5);
        Mascota m2 = new Mascota("Michi", "gato");
        Mascota m3 = new Mascota();
        m1.presentarse();
        m2.presentarse();
        m3.presentarse();
        m2.setPeso(4.2);
        m2.presentarse();
    }
}`,
    }],
    expect: ['Soy Firulais, un perro de 12.5 kg', 'Soy Michi, un gato de 0.0 kg', 'Soy Doge, un perro de 8.0 kg', 'Soy Michi, un gato de 4.2 kg'],
  },
  /* 3 */ {
    title: 'Calculadora con métodos static y sobrecarga',
    intro: 'Practica firmas, return y sobrecarga escribiendo una clase utilitaria.',
    steps: [
      IDE_START + ' Nombre: `Calculadora`.',
      'Crea la clase `Calculadora` con métodos **public static**: `sumar(int a, int b)`, `sumar(double a, double b)`, `sumar(int a, int b, int c)`, `promedio(double a, double b)`, `esPar(int n)` (boolean) y `mayorDeTres(int a, int b, int c)`.',
      'Ninguno imprime: todos **retornan**.',
      'Crea `Main` con el código de abajo, ejecútalo y pega la consola.',
    ],
    files: [{
      name: 'Main.java',
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("sumar(2, 3) = " + Calculadora.sumar(2, 3));
        System.out.println("sumar(2.5, 3.0) = " + Calculadora.sumar(2.5, 3.0));
        System.out.println("sumar(1, 2, 3) = " + Calculadora.sumar(1, 2, 3));
        System.out.println("promedio(6, 7) = " + Calculadora.promedio(6, 7));
        System.out.println("esPar(10) = " + Calculadora.esPar(10));
        System.out.println("mayorDeTres(4, 9, 2) = " + Calculadora.mayorDeTres(4, 9, 2));
    }
}`,
    }],
    expect: ['sumar(2, 3) = 5', 'sumar(2.5, 3.0) = 5.5', 'sumar(1, 2, 3) = 6', 'promedio(6, 7) = 6.5', 'esPar(10) = true', 'mayorDeTres(4, 9, 2) = 9'],
  },
  /* 4 */ {
    title: 'Cuenta bancaria blindada',
    intro: 'Encapsulamiento de verdad: nadie toca el saldo sin pasar por tus validaciones.',
    steps: [
      IDE_START + ' Nombre: `Banco`.',
      'Clase `CuentaBancaria`: `private String titular`, `private double saldo`. El constructor `(titular, saldoInicial)` usa setters.',
      '`depositar(double monto)`: si monto ≤ 0 lanza `IllegalArgumentException("El monto debe ser mayor a 0")`.',
      '`girar(double monto)`: si monto > saldo lanza `IllegalArgumentException("Saldo insuficiente")`.',
      '`toString()` retorna `Cuenta de <titular>: $<saldo>`.',
      'Crea `Main` con el código de abajo, ejecútalo y pega la consola.',
    ],
    files: [{
      name: 'Main.java',
      code: `public class Main {
    public static void main(String[] args) {
        CuentaBancaria c = new CuentaBancaria("Ana", 1000);
        c.depositar(500);
        System.out.println(c);
        try {
            c.girar(5000);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
        try {
            c.depositar(-10);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
        c.girar(300);
        System.out.println(c);
    }
}`,
    }],
    expect: ['Cuenta de Ana: $1500.0', 'Error: Saldo insuficiente', 'Error: El monto debe ser mayor a 0', 'Cuenta de Ana: $1200.0'],
  },
  /* 5 */ {
    title: 'Bencinera completa (ejercicio tipo prueba)',
    intro: 'El ejercicio de la clase 1.3.1, de punta a punta. Así se ve una pregunta de desarrollo de la prueba.',
    steps: [
      IDE_START + ' Nombre: `Bencinera`.',
      'Clase `Combustible(String tipo, int precioLitro)` con validaciones (tipo no vacío, precio > 0) y getters.',
      'Clase `Venta(Combustible combustible, int litros)` con `int calcularTotal()`.',
      'Clase `Pago` con `int calcularCambio(int total, int monto)`: si no alcanza imprime `Pago insuficiente` y retorna -1.',
      'Crea `Main` con el código de abajo, ejecútalo y pega la consola.',
    ],
    files: [{
      name: 'Main.java',
      code: `public class Main {
    public static void main(String[] args) {
        Combustible c93 = new Combustible("93", 1100);
        Combustible diesel = new Combustible("Diesel", 900);
        Pago pago = new Pago();

        Venta v1 = new Venta(c93, 20);
        System.out.println("Total: $" + v1.calcularTotal());
        System.out.println("Cambio: $" + pago.calcularCambio(v1.calcularTotal(), 25000));

        Venta v2 = new Venta(diesel, 50);
        System.out.println("Total: $" + v2.calcularTotal());
        pago.calcularCambio(v2.calcularTotal(), 40000);

        try {
            new Combustible("", 1000);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`,
    }],
    expect: ['Total: $22000', 'Cambio: $3000', 'Total: $45000', 'Pago insuficiente', /^Error: .+/],
  },
  /* 6 */ {
    title: 'Zoológico polimórfico',
    intro: 'Herencia en tres niveles y una lista del tipo padre que se comporta distinto según cada hijo.',
    steps: [
      IDE_START + ' Nombre: `Zoologico`.',
      '`Animal(String nombre)` con `protected String nombre`, `public String sonido()` que retorna `"..."` y `public void describir()` que imprime `<nombre> dice <sonido()>`.',
      '`Perro` y `Gato` extienden Animal y sobrescriben `sonido()` → `"Guau"` / `"Miau"`.',
      '`TipoPerro(String nombre, String raza)` extiende Perro: `sonido()` retorna `super.sonido() + " " + super.sonido()` y `describir()` imprime `<nombre> (<raza>) dice <sonido()>`.',
      'Crea `Main` con el código de abajo, ejecútalo y pega la consola.',
    ],
    files: [{
      name: 'Main.java',
      code: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Animal> zoo = new ArrayList<>();
        zoo.add(new Perro("Toby"));
        zoo.add(new Gato("Michi"));
        zoo.add(new TipoPerro("Rex", "Pastor Alemán"));
        zoo.add(new Animal("Pez"));
        for (Animal a : zoo) {
            a.describir();
        }
    }
}`,
    }],
    expect: ['Toby dice Guau', 'Michi dice Miau', 'Rex (Pastor Alemán) dice Guau Guau', 'Pez dice ...'],
  },
  /* 7 */ {
    title: 'Transportes Veloz: clases (molde de la prueba)',
    intro: 'El segundo caso del resumen de la prueba. Pasos ① ② ③ del molde: interfaz, padre abstracto e hijas.',
    steps: [
      IDE_START + ' Nombre: `TransportesVeloz` (lo vas a reutilizar en la misión 8).',
      '① Interfaz `Revisable`: `boolean estaDisponibleRevision()` y `void marcarDisponibleRevision()`.',
      '② `abstract class Vehiculo(String patente, int anio, int kilometraje)`: atributos privados, constructor con setters, `setKilometraje` lanza `IllegalArgumentException` si es negativo, getters, `abstract double calcularCostoMantenimiento()` y `toString()` → `Patente: <patente>, año: <anio>, km: <kilometraje>`.',
      '③ `Camion(..., double capacidadCarga)`: si capacidad > 10 → `100000 * 1.30`, si no `100000`.',
      '③ `Auto(..., int numeroPuertas, String tipoTransmision) implements Revisable`: si es `"Manual"` → `50000 * 1.15`, si no `50000`.',
      'Crea `Main` con el código de abajo, ejecútalo y pega la consola.',
    ],
    files: [{
      name: 'Main.java',
      code: `public class Main {
    public static void main(String[] args) {
        Auto a1 = new Auto("AA1111", 2022, 15000, 4, "Manual");
        Vehiculo[] flota = {
            new Camion("CC1234", 2020, 50000, 12),
            new Camion("DD5678", 2018, 90000, 8),
            a1,
            new Auto("BB2222", 2021, 30000, 2, "Automatica")
        };
        for (Vehiculo v : flota) {
            // Math.round evita ver 57499.99999999999 (así funcionan los double)
            System.out.println(v.getPatente() + ": $" + Math.round(v.calcularCostoMantenimiento()));
        }
        System.out.println("¿Disponible? " + a1.estaDisponibleRevision());
        a1.marcarDisponibleRevision();
        System.out.println("¿Disponible? " + a1.estaDisponibleRevision());
        try {
            new Camion("EE0000", 2020, -5, 3);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`,
    }],
    expect: ['CC1234: $130000', 'DD5678: $100000', 'AA1111: $57500', 'BB2222: $50000', '¿Disponible? false', '¿Disponible? true', /^Error: .+/],
    note: '50000 * 1.15 da 57499.99999999999 en Java por cómo se guardan los decimales. No es un error tuyo.',
  },
  /* 8 */ {
    title: 'Transportes Veloz: Gestor y Main (simulacro completo)',
    intro: 'Pasos ④ y ⑤ del molde. Con esto haces un ejercicio de prueba completo en un IDE real.',
    steps: [
      'Abre el proyecto `TransportesVeloz` de la misión 7.',
      '④ Clase `Empresa` con `ArrayList<Vehiculo> lista`: `registrar(Vehiculo x)` (imprime `Registrado correctamente: <patente>`), `buscar(String patente)` (si no está imprime `No se encontró: <patente>` y retorna null), `listar()` y `mostrarCostos()` (imprime `<patente>: $<costo>`).',
      '⑤ Reemplaza el `Main` con el código de abajo, ejecútalo y pega la consola.',
    ],
    files: [{
      name: 'Main.java',
      code: `public class Main {
    public static void main(String[] args) {
        Empresa e = new Empresa();
        e.registrar(new Camion("CC1234", 2020, 50000, 12));
        e.registrar(new Auto("BB2222", 2021, 30000, 2, "Automatica"));
        System.out.println(e.buscar("BB2222"));
        e.buscar("ZZ9999");
        e.listar();
        e.mostrarCostos();
    }
}`,
    }],
    expect: [
      'Registrado correctamente: CC1234', 'Registrado correctamente: BB2222',
      'Patente: BB2222, año: 2021, km: 30000', 'No se encontró: ZZ9999',
      'Patente: CC1234, año: 2020, km: 50000', 'Patente: BB2222, año: 2021, km: 30000',
      'CC1234: $130000.0', 'BB2222: $50000.0',
    ],
  },
  /* 9 */ {
    title: 'Tu primera ventana JavaFX con Maven',
    intro: 'Guías 2.1.4 y 2.1.5 en tu PC: proyecto Maven, ventana en FXML y ciclo de vida.',
    steps: [
      'IntelliJ → **New Project** → generador **JavaFX** → Language **Java**, Build system **Maven**, JDK 17 o 21 → Next → marca `javafx-controls` y `javafx-fxml` → Create.',
      'Ubica los 3 archivos: `HelloApplication.java`, `HelloController.java` y `src/main/resources/.../hello-view.fxml`.',
      'Reemplaza el contenido de `hello-view.fxml` por el de abajo (ajusta el paquete en `fx:controller` al tuyo).',
      'En `HelloApplication` agrega los métodos `init()` y `stop()` de abajo, y un `System.out.println("start()");` al inicio de `start`.',
      'Ejecuta (▶), mira tu ventana 🎉, **ciérrala** y pega la consola.',
    ],
    files: [
      {
        name: 'hello-view.fxml',
        lang: 'xml',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.geometry.Insets?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>

<VBox alignment="CENTER" spacing="12.0"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.example.demo.HelloController">
    <padding>
        <Insets top="20" right="20" bottom="20" left="20"/>
    </padding>
    <Label text="Registro básico de usuario" style="-fx-font-size: 22px; -fx-font-weight: bold;"/>
    <Label text="Complete los siguientes datos"/>
    <TextField promptText="Ingrese su nombre" maxWidth="240"/>
    <CheckBox text="Acepto continuar con el ejercicio"/>
    <HBox alignment="CENTER" spacing="10.0">
        <Button text="Guardar"/>
        <Button text="Limpiar"/>
    </HBox>
</VBox>`,
      },
      {
        name: 'HelloApplication.java (agregar)',
        code: `@Override
public void init() {
    System.out.println("init()");
}

@Override
public void stop() {
    System.out.println("stop()");
}`,
      },
    ],
    expect: ['init()', 'start()', 'stop()'],
  },
  /* 10 */ {
    title: 'Gestor de estudiantes MVC',
    intro: 'La guía 2.3.5 construida por ti: tabla, formulario, validación y navegación entre dos vistas.',
    steps: [
      'Crea un proyecto JavaFX + Maven llamado `GestorEstudiantesFX` y los paquetes `app`, `model`, `controller` (los FXML en `resources/view`).',
      '`model`: `Estudiante(id, nombre, correo, edad)` con getters y `EstudianteRepository` con una `ObservableList` estática y `agregar(...)`.',
      '`lista-view.fxml` con una `TableView` (columnas id, nombre, correo, edad) y un botón **Nuevo estudiante**; `ListaController.initialize()` configura las columnas y hace `setItems(...)`.',
      '`form-view.fxml` con 3 `TextField`, un `Label` de mensajes y botones **Guardar** / **Volver**.',
      '`FormController.guardarEstudiante()` valida (nombre no vacío, correo con @, edad numérica > 0), agrega y al final hace `System.out.println("Guardado: " + nombre);`',
      '`AppNavigator` para cambiar entre vistas. Ejecuta, registra un estudiante válido y verifica que aparezca en la tabla.',
      'Pega la consola.',
    ],
    files: [],
    expect: [/^Guardado: \S+/],
  },
  /* 11 */ {
    title: 'Guardar estudiantes en JSON',
    intro: 'La guía 2.4.3: agrega persistencia al gestor de la misión 10.',
    steps: [
      'En el `pom.xml` agrega `com.fasterxml.jackson.core:jackson-databind:2.22.0` y recarga Maven.',
      'Agrega a `Estudiante` el **constructor vacío** y los setters.',
      'Crea `EstudianteDao` (interfaz) y `JsonEstudianteDao` con `ObjectMapper` (archivo `estudiantes.json`).',
      'El `EstudianteRepository` usa el DAO: `cargarDesdeJson()` y `guardarEnJson()`. Agrega botones **Cargar JSON** y **Guardar JSON**.',
      'Ejecuta, registra **al menos 2 estudiantes** y presiona Guardar JSON.',
      'Abre `estudiantes.json` (en la carpeta del proyecto) y pega su contenido abajo.',
    ],
    files: [],
    expect: 'json',
  },
  /* 12 */ {
    title: 'CRUD con MySQL',
    intro: 'Materia 3.x: conecta tu app a una base de datos real.',
    steps: [
      'Instala MySQL (o usa XAMPP) y crea la base `tienda_fx` con la tabla `producto` de la unidad.',
      'Agrega `com.mysql:mysql-connector-j:9.7.0` al `pom.xml`.',
      'Crea `DatabaseConnection` con tu usuario y contraseña, y prueba la conexión con try-with-resources.',
      'Pega la consola cuando veas el mensaje de éxito.',
    ],
    files: [],
    expect: ['Conexión exitosa a MySQL'],
  },
];
