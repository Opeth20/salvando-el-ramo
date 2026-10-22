import { c, teoria, fill, line, write, fix, out, level, unit } from './helpers.js';

// Unidades 5–8: comunicación entre clases, herencia, abstractas/interfaces, colecciones.
export default [
  /* ======================= UNIDAD 5 ======================= */
  unit('Comunicación entre clases', 'Objetos que usan otros objetos y clases reutilizables', 'pink', [
    level('Un objeto dentro de otro', '🤝', [
      teoria('Relación "tiene un"',
        'Una clase puede tener como atributo un **objeto de otra clase**. Así las clases trabajan juntas.',
        c(`public class Auto {
    private String modelo;
    private Persona propietario;      // Auto TIENE UNA Persona

    public Auto(String modelo, Persona propietario) {
        this.modelo = modelo;
        this.propietario = propietario;
    }

    public void mostrarDetalles() {
        System.out.println("Modelo: " + modelo);
        propietario.saludar();        // usa un método de Persona
    }
}

// main
Persona juan = new Persona("Juan", 30);
Auto auto = new Auto("Toyota", juan);
auto.mostrarDetalles();`),
        '<div class="tip">`Persona.saludar()` imprime: `Hola, me llamo Juan y tengo 30 años.`</div>'),
      fill('Completa la clase Auto.',
        `public class Auto {
    private String modelo;
    private [[Persona]] propietario;

    public void mostrarDetalles() {
        System.out.println("Modelo: " + modelo);
        [[propietario]].[[saludar]]();
    }
}`),
      write('En el main: crea `Persona juan` con nombre `"Juan"` y edad `30`, luego un `Auto auto` modelo `"Toyota"` cuyo propietario sea `juan`.', {
        starter: '',
        checks: [
          ['Persona juan=new Persona("Juan",30);', 'Persona juan = new Persona("Juan", 30);'],
          ['Auto auto=new Auto("Toyota",juan);', 'Auto auto = new Auto("Toyota", juan);'],
        ],
        solution: `Persona juan = new Persona("Juan", 30);
Auto auto = new Auto("Toyota", juan);`,
      }),
      write('Agrega a `Auto` el método `cambiarNombrePropietario(String nuevoNombre)` que modifique el nombre de su propietario.', {
        starter: '',
        checks: [
          ['public void cambiarNombrePropietario(String nuevoNombre){', 'public void cambiarNombrePropietario(String nuevoNombre)'],
          [['propietario.setNombre(nuevoNombre);', 'this.propietario.setNombre(nuevoNombre);'], 'Usa el setter del propietario: propietario.setNombre(nuevoNombre)'],
        ],
        solution: `public void cambiarNombrePropietario(String nuevoNombre) {
    propietario.setNombre(nuevoNombre);
}`,
      }),
      out('¿Qué imprime este main?',
        `Persona propietario = new Persona("Juan", 30);
Auto auto = new Auto("Toyota", propietario);
auto.mostrarDetalles();
auto.cambiarNombrePropietario("Carlos");
auto.mostrarDetalles();`,
        'Modelo: Toyota\nHola, me llamo Juan y tengo 30 años.\nModelo: Toyota\nHola, me llamo Carlos y tengo 30 años.'),
      fix('¡NullPointerException! El auto no tiene propietario. Corrige el main creando una `Persona` y pasándola al auto.', {
        starter: `Auto auto = new Auto("Toyota", null);
auto.mostrarDetalles();`,
        checks: [
          [/Persona \w+=new Persona\(/, 'Crea una Persona'],
          [/new Auto\("Toyota",\w+\);/, 'Pasa esa persona al constructor de Auto'],
          { not: 'null', label: 'No uses null como propietario' },
        ],
        solution: `Persona p = new Persona("Ana", 25);
Auto auto = new Auto("Toyota", p);
auto.mostrarDetalles();`,
      }),
    ]),

    level('Clases reutilizables', '♻️', [
      teoria('Reutilización y extensibilidad',
        'Una clase eficiente **calcula y retorna**; quien la usa decide qué hacer con el resultado (imprimirlo, guardarlo, mostrarlo en una ventana...).',
        c(`// ❌ Poco reutilizable: siempre imprime
public void imprimirSueldo() {
    System.out.println("El sueldo es: " + (sueldoBase + bonificacion));
}

// ✅ Reutilizable: retorna el valor
public double calcularSueldo() {
    return sueldoBase + bonificacion;
}`)),
      write('Reescribe el método para que se llame `calcularSueldo`, **retorne** un `double` con `sueldoBase + bonificacion` y no imprima nada.', {
        starter: `public void imprimirSueldo() {
    System.out.println("El sueldo de " + nombre + " es: " + (sueldoBase + bonificacion));
}`,
        checks: [
          ['public double calcularSueldo(){', 'public double calcularSueldo()'],
          [['return sueldoBase+bonificacion;', 'return(sueldoBase+bonificacion);', 'return this.sueldoBase+this.bonificacion;'], 'return sueldoBase + bonificacion;'],
          { not: 'System.out.println', label: 'No imprimas dentro del método' },
        ],
        solution: `public double calcularSueldo() {
    return sueldoBase + bonificacion;
}`,
      }),
      out('Con `sueldoBase` y `bonificacion` de tipo `double`, ¿qué imprime?',
        `Empleado empleado = new Empleado("Juan", 2000, 500);
double sueldo = empleado.calcularSueldo();
System.out.println("El sueldo de " + empleado.getNombre() + " es: " + sueldo);`,
        'El sueldo de Juan es: 2500.0', { explain: 'Un double siempre se imprime con decimal: 2500.0' }),
      line('Guarda en `double total` la suma de los sueldos de los objetos `e1` y `e2` usando `calcularSueldo()`.', {
        checks: [['double total=e1.calcularSueldo()+e2.calcularSueldo();', 'double total = e1.calcularSueldo() + e2.calcularSueldo();']],
        solution: 'double total = e1.calcularSueldo() + e2.calcularSueldo();',
      }),
    ]),

    level('Prueba: Bencinera', '⛽', [
      teoria('Ejercicio tipo prueba',
        'Una bencinera quiere un sistema con 3 clases:',
        `<ul>
<li>**Combustible**: tipo (93, 95, 97, Diesel) y precio por litro. Validar: tipo no vacío y precio > 0.</li>
<li>**Venta**: un Combustible y una cantidad de litros (> 0). Calcula el total = precio × litros.</li>
<li>**Pago**: recibe el total y el monto pagado. Si el monto alcanza, retorna el cambio; si no, avisa "Pago insuficiente".</li></ul>
<table><tr><th>Tipo</th><th>Precio/L</th></tr><tr><td>93</td><td>$1100</td></tr><tr><td>95</td><td>$1200</td></tr><tr><td>97</td><td>$1300</td></tr><tr><td>Diesel</td><td>$900</td></tr></table>`),
      write('Escribe la clase `Combustible` con `private String tipo`, `private int precioLitro`, un constructor que use setters, y setters que validen (tipo vacío o precio ≤ 0 → `IllegalArgumentException`). Incluye los getters.', {
        starter: '',
        checks: [
          ['public class Combustible{', 'public class Combustible'],
          ['private String tipo;', 'private String tipo;'],
          ['private int precioLitro;', 'private int precioLitro;'],
          [/public Combustible\(String \w+,int \w+\)\{/, 'Constructor Combustible(String tipo, int precioLitro)'],
          [/setTipo\(\w+\);/, 'El constructor llama a setTipo'],
          [/setPrecioLitro\(\w+\);/, 'El constructor llama a setPrecioLitro'],
          [/isEmpty\(\)|isBlank\(\)/, 'Valida que el tipo no esté vacío'],
          [/precioLitro<=0|\w+<=0/, 'Valida que el precio sea mayor a 0'],
          ['throw new IllegalArgumentException(', 'Lanza IllegalArgumentException si algo es inválido'],
          ['public String getTipo(){', 'Getter getTipo()'],
          ['public int getPrecioLitro(){', 'Getter getPrecioLitro()'],
        ],
        solution: `public class Combustible {
    private String tipo;
    private int precioLitro;

    public Combustible(String tipo, int precioLitro) {
        setTipo(tipo);
        setPrecioLitro(precioLitro);
    }

    public String getTipo() { return tipo; }
    public int getPrecioLitro() { return precioLitro; }

    public void setTipo(String tipo) {
        if (tipo == null || tipo.isEmpty()) {
            throw new IllegalArgumentException("El tipo no puede estar vacío");
        }
        this.tipo = tipo;
    }

    public void setPrecioLitro(int precioLitro) {
        if (precioLitro <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        this.precioLitro = precioLitro;
    }
}`,
      }),
      write('Escribe la clase `Venta` con `private Combustible combustible` y `private int litros`, su constructor, y el método `public int calcularTotal()` que retorne precio por litro × litros.', {
        starter: '',
        checks: [
          ['public class Venta{', 'public class Venta'],
          ['private Combustible combustible;', 'private Combustible combustible;'],
          ['private int litros;', 'private int litros;'],
          [/public Venta\(Combustible \w+,int \w+\)\{/, 'Constructor Venta(Combustible combustible, int litros)'],
          ['public int calcularTotal(){', 'public int calcularTotal()'],
          [/return (this\.)?combustible\.getPrecioLitro\(\)\*(this\.)?litros;|return (this\.)?litros\*(this\.)?combustible\.getPrecioLitro\(\);/, 'Retorna combustible.getPrecioLitro() * litros'],
        ],
        solution: `public class Venta {
    private Combustible combustible;
    private int litros;

    public Venta(Combustible combustible, int litros) {
        this.combustible = combustible;
        this.litros = litros;
    }

    public int calcularTotal() {
        return combustible.getPrecioLitro() * litros;
    }
}`,
      }),
      write('Escribe en la clase `Pago` el método `public int calcularCambio(int total, int monto)`: si `monto < total` imprime `Pago insuficiente` y retorna -1; si no, retorna `monto - total`.', {
        starter: '',
        checks: [
          ['public int calcularCambio(int total,int monto){', 'public int calcularCambio(int total, int monto)'],
          [/if\(monto<total\)|if\(total>monto\)/, 'if (monto < total)'],
          ['System.out.println("Pago insuficiente");', 'Imprime "Pago insuficiente"'],
          ['return -1;', 'Retorna -1 cuando no alcanza'],
          ['return monto-total;', 'Retorna monto - total'],
        ],
        solution: `public int calcularCambio(int total, int monto) {
    if (monto < total) {
        System.out.println("Pago insuficiente");
        return -1;
    }
    return monto - total;
}`,
      }),
      out('Escenario 1 de la prueba. ¿Qué imprime?',
        `Combustible c93 = new Combustible("93", 1100);
Venta venta = new Venta(c93, 20);
int total = venta.calcularTotal();
Pago pago = new Pago();
System.out.println("Total: $" + total);
System.out.println("Cambio: $" + pago.calcularCambio(total, 25000));`,
        'Total: $22000\nCambio: $3000'),
      out('Escenario 2: Diesel, 50 litros, paga $40.000. ¿Qué imprime?',
        `Combustible diesel = new Combustible("Diesel", 900);
Venta venta = new Venta(diesel, 50);
int total = venta.calcularTotal();
Pago pago = new Pago();
System.out.println("Total: $" + total);
int cambio = pago.calcularCambio(total, 40000);`,
        'Total: $45000\nPago insuficiente'),
    ]),
  ]),

  /* ======================= UNIDAD 6 ======================= */
  unit('Herencia y polimorfismo', 'extends, super, @Override, protected y polimorfismo', 'teal', [
    level('extends y super', '🧬', [
      teoria('Herencia',
        'La **subclase** hereda atributos y métodos de la **superclase** y agrega los suyos. Se usa cuando hay una relación **"es un"**.',
        c(`public class Joya {
    protected String codigo, nombre, material;

    public Joya(String codigo, String nombre, String material) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.material = material;
    }
}

public class Anillo extends Joya {          // Anillo ES UNA Joya
    private int medida;

    public Anillo(String codigo, String nombre, String material, int medida) {
        super(codigo, nombre, material);    // ← SIEMPRE la primera línea
        this.medida = medida;
    }
}`),
        '<div class="tip">🔗 "Es un" → herencia (`Docente extends Empleado`). "Tiene un" → atributo (`private Cargo cargo;`).</div><div class="tip">🌳 Toda clase en Java hereda, directa o indirectamente, de `Object`.</div>'),
      fill('Completa la subclase Cadena.',
        `public class Cadena [[extends]] Joya {
    private double largoCadena;

    public Cadena(String codigo, String nombre, String material, double largoCadena) {
        [[super]](codigo, nombre, material);
        this.largoCadena = [[largoCadena]];
    }
}`),
      line('Un Docente **es un** Empleado. Escribe la primera línea de la clase `Docente`.', {
        checks: [['public class Docente extends Empleado{', 'public class Docente extends Empleado {']],
        solution: 'public class Docente extends Empleado {',
      }),
      line('Un Docente **tiene un** Cargo. Declara ese atributo privado llamado `cargo`.', {
        checks: [['private Cargo cargo;', 'private Cargo cargo;']],
        solution: 'private Cargo cargo;',
      }),
      fix('Error: "call to super must be first statement in constructor". Corrígelo.', {
        starter: `public Anillo(String codigo, String nombre, String material, int medida) {
    this.medida = medida;
    super(codigo, nombre, material);
}`,
        checks: [[/\)\{super\(codigo,nombre,material\);/, 'super(...) debe ser la primera instrucción']],
        solution: `public Anillo(String codigo, String nombre, String material, int medida) {
    super(codigo, nombre, material);
    this.medida = medida;
}`,
      }),
      out('¿En qué orden se ejecutan los constructores?',
        `class Animal {
    public Animal() {
        System.out.println("Animal creado");
    }
}

class Perro extends Animal {
    public Perro() {
        System.out.println("Perro creado");
    }
}

public class Main {
    public static void main(String[] args) {
        new Perro();
    }
}`,
        'Animal creado\nPerro creado', { explain: 'Primero se construye la parte del padre (super() implícito) y luego la del hijo.' }),
    ]),

    level('Sobrescritura', '✍️', [
      teoria('@Override y protected',
        '**Sobrescribir** es redefinir en la subclase un método heredado, con **la misma firma** (nombre, parámetros y retorno).',
        c(`public class Animal {
    protected String tipo, sonido;     // protected: visible en las subclases

    public void hacerSonido() {
        System.out.println("El " + tipo + " hace " + sonido);
    }
}

public class Perro extends Animal {
    protected String color;

    @Override
    public void hacerSonido() {
        System.out.println("El perro de color " + color + " ladra");
    }
}`),
        '<div class="warn">⚠️ Un atributo `private` del padre NO se puede usar directo en la subclase. Usa `protected` o un getter.</div><div class="tip">`super.metodo()` llama a la versión del padre.</div>'),
      fill('Completa la sobrescritura.',
        `public class Gato extends Animal {
    [[@Override]]
    public [[void]] hacerSonido() {
        System.out.println("Miau");
    }
}`),
      write('Escribe la clase `Gato` que extienda `Animal` y sobrescriba `hacerSonido()` para imprimir `El gato maúlla`.', {
        starter: '',
        checks: [
          ['public class Gato extends Animal{', 'public class Gato extends Animal'],
          ['@Override', 'Usa @Override'],
          ['public void hacerSonido(){', 'public void hacerSonido()'],
          [/System\.out\.println\("El gato ma(ú|u)lla"\);/, 'Imprime "El gato maúlla"'],
        ],
        solution: `public class Gato extends Animal {
    @Override
    public void hacerSonido() {
        System.out.println("El gato maúlla");
    }
}`,
      }),
      fix('`TipoPerro` no compila: "color has private access in Perro". Cambia el modificador para que las subclases puedan usarlo.', {
        starter: `public class Perro extends Animal {
    private String color;

    public Perro(String color) {
        super("Perro", "ladra");
        this.color = color;
    }
}`,
        checks: [['protected String color;', 'protected String color;']],
        solution: `public class Perro extends Animal {
    protected String color;

    public Perro(String color) {
        super("Perro", "ladra");
        this.color = color;
    }
}`,
      }),
      write('En la clase `Auto extends Vehiculo` sobrescribe `toString()` para que retorne lo del padre + `, puertas: ` + `numeroPuertas`.', {
        starter: '',
        checks: [
          ['@Override', 'Usa @Override'],
          ['public String toString(){', 'public String toString()'],
          [/return super\.toString\(\)\+", puertas: "\+(this\.)?numeroPuertas;/, 'return super.toString() + ", puertas: " + numeroPuertas;'],
        ],
        solution: `@Override
public String toString() {
    return super.toString() + ", puertas: " + numeroPuertas;
}`,
      }),
      out('¿Qué imprime?',
        `class Animal {
    public void hacerSonido() {
        System.out.println("El animal hace un sonido");
    }
}

class Perro extends Animal {
    @Override
    public void hacerSonido() {
        super.hacerSonido();
        System.out.println("El perro ladra");
    }
}

public class Main {
    public static void main(String[] args) {
        new Perro().hacerSonido();
    }
}`,
        'El animal hace un sonido\nEl perro ladra'),
    ]),

    level('Polimorfismo', '🦎', [
      teoria('Una variable, muchas formas',
        'Una variable del tipo **padre** puede guardar cualquier objeto **hijo**. Al llamar un método, se ejecuta la versión del objeto real.',
        c(`Animal a1 = new Animal();
Animal a2 = new Perro();       // un Perro ES un Animal
a2.hacerSonido();              // ejecuta la versión de Perro

ArrayList<Animal> zoo = new ArrayList<>();
zoo.add(new Perro());
zoo.add(new Gato());
for (Animal a : zoo) {
    a.hacerSonido();           // cada uno suena distinto
}`),
        `<table><tr><th></th><th>Sobrecarga</th><th>Sobrescritura</th></tr>
<tr><td>Dónde</td><td>Misma clase (o subclase)</td><td>Siempre en la subclase</td></tr>
<tr><td>Parámetros</td><td>Distintos</td><td>Iguales</td></tr>
<tr><td>Anotación</td><td>—</td><td>\`@Override\`</td></tr></table>`),
      line('Declara una variable de tipo `Animal` llamada `mascota` que guarde un nuevo `Perro`.', {
        checks: [['Animal mascota=new Perro();', 'Animal mascota = new Perro();']],
        solution: 'Animal mascota = new Perro();',
      }),
      out('¿Qué imprime?',
        `class Animal {
    public String sonido() { return "..."; }
}
class Perro extends Animal {
    @Override
    public String sonido() { return "Guau"; }
}
class Gato extends Animal {
    @Override
    public String sonido() { return "Miau"; }
}

public class Main {
    public static void main(String[] args) {
        Animal[] animales = { new Perro(), new Gato(), new Animal() };
        for (Animal a : animales) {
            System.out.println(a.sonido());
        }
    }
}`,
        'Guau\nMiau\n...'),
      write('Escribe `public static void presentar(Animal a)` que llame a `a.hacerSonido()`. Luego, en el main, llámalo pasándole un `new Gato()`.', {
        starter: `public class Main {
    // tu método aquí

    public static void main(String[] args) {
        // tu llamada aquí
    }
}`,
        checks: [
          ['public static void presentar(Animal a){', 'public static void presentar(Animal a)'],
          ['a.hacerSonido();', 'Dentro llama a a.hacerSonido()'],
          ['presentar(new Gato());', 'En el main: presentar(new Gato());'],
        ],
        solution: `public class Main {
    public static void presentar(Animal a) {
        a.hacerSonido();
    }

    public static void main(String[] args) {
        presentar(new Gato());
    }
}`,
      }),
      fill('Escribe el nombre del concepto en cada comentario.',
        `class Comida {
    public void cocinar(int grados) { ... }
}
class NoSaludable extends Comida {
    @Override
    public void cocinar(int grados) { ... }   // [[sobrescritura|Sobrescritura|sobreescritura]]
}
class Motor {
    public void encender() { ... }
    public void encender(char tipo) { ... }   // [[sobrecarga|Sobrecarga]]
}`),
      out('Sobrecarga + sobrescritura juntas. ¿Qué imprime?',
        `class Figura {
    public String dibujar() { return "Figura"; }
    public String dibujar(String color) { return "Figura " + color; }
}
class Circulo extends Figura {
    @Override
    public String dibujar() { return "Círculo"; }
}

public class Main {
    public static void main(String[] args) {
        Figura f = new Circulo();
        System.out.println(f.dibujar());
        System.out.println(f.dibujar("rojo"));
    }
}`,
        'Círculo\nFigura rojo', { explain: '`dibujar()` está sobrescrito en Circulo. `dibujar(String)` no, así que se usa el del padre.' }),
    ]),
  ]),

  /* ======================= UNIDAD 7 ======================= */
  unit('Clases abstractas e interfaces', 'abstract, interface, implements — el molde de la prueba', 'red', [
    level('Clases abstractas', '👻', [
      teoria('abstract',
        'Una **clase abstracta** es un molde incompleto: **no se puede instanciar**. Sus **métodos abstractos** no tienen cuerpo y las subclases están obligadas a implementarlos.',
        c(`public abstract class Vehiculo {
    private String patente;

    public Vehiculo(String patente) {
        setPatente(patente);
    }

    public abstract double calcularCostoMantenimiento();   // sin { }
}

public class Camion extends Vehiculo {
    private double capacidadCarga;

    public Camion(String patente, double capacidadCarga) {
        super(patente);
        this.capacidadCarga = capacidadCarga;
    }

    @Override
    public double calcularCostoMantenimiento() {
        if (capacidadCarga > 10) {
            return 100000 * 1.30;
        }
        return 100000;
    }
}`),
        '<div class="warn">⚠️ `new Vehiculo(...)` → error. `Vehiculo v = new Camion(...)` → ✅</div>'),
      fill('Completa la clase abstracta.',
        `public [[abstract]] class Vehiculo {
    private String patente;
    public [[abstract]] double calcularCostoMantenimiento()[[;]]
}`),
      fix('Un método abstracto no tiene cuerpo. Corrígelo.', {
        starter: `public abstract class Cliente {
    public abstract double calcularMembresia() {
        return 0;
    }
}`,
        checks: [
          ['public abstract double calcularMembresia();', 'public abstract double calcularMembresia();'],
          { not: 'return 0;', label: 'Quita el cuerpo del método' },
        ],
        solution: `public abstract class Cliente {
    public abstract double calcularMembresia();
}`,
      }),
      fix('`Vehiculo` es abstracta: no se puede instanciar. Crea un `Camion` con la misma patente y capacidad `12`.', {
        starter: `Vehiculo v = new Vehiculo("AB1234");
System.out.println(v.calcularCostoMantenimiento());`,
        checks: [
          { not: 'new Vehiculo(', label: 'No hagas new Vehiculo(...)' },
          [/new Camion\("AB1234",12(\.0)?\)/, 'Usa new Camion("AB1234", 12)'],
        ],
        solution: `Vehiculo v = new Camion("AB1234", 12);
System.out.println(v.calcularCostoMantenimiento());`,
      }),
      write('Implementa en `Auto extends Vehiculo` el método `calcularCostoMantenimiento()`: si `tipoTransmision` es `"Manual"` retorna `50000 * 1.15`; si no, `50000`.', {
        starter: '',
        checks: [
          ['@Override', 'Usa @Override'],
          ['public double calcularCostoMantenimiento(){', 'public double calcularCostoMantenimiento()'],
          [/tipoTransmision\.equals\("Manual"\)|"Manual"\.equals\(tipoTransmision\)|equalsIgnoreCase\("Manual"\)/, 'Compara el String con .equals("Manual")'],
          [['return 50000*1.15;', 'return 57500;', 'return 57500.0;'], 'Retorna 50000 * 1.15 si es Manual'],
          [['return 50000;', 'return 50000.0;'], 'Si no, retorna 50000'],
          { not: '=="Manual"', label: 'Los String NO se comparan con ==' },
        ],
        solution: `@Override
public double calcularCostoMantenimiento() {
    if (tipoTransmision.equals("Manual")) {
        return 50000 * 1.15;
    }
    return 50000;
}`,
      }),
    ]),

    level('Interfaces', '📜', [
      teoria('interface = contrato',
        'Una **interfaz** declara métodos que una clase se compromete a implementar. Una clase hereda de **una** sola clase, pero puede implementar **varias** interfaces.',
        c(`public interface Revisable {
    boolean estaDisponibleRevision();
    void marcarDisponibleRevision();
}

public class Auto extends Vehiculo implements Revisable {
    private boolean disponibleRevision;

    @Override
    public boolean estaDisponibleRevision() { return disponibleRevision; }

    @Override
    public void marcarDisponibleRevision() { disponibleRevision = true; }
}`)),
      fill('Completa la interfaz y su implementación.',
        `public [[interface]] Accesible {
    boolean tieneAccesoEspecial();
    void otorgarAccesoEspecial();
}

public class ClientePremium extends Cliente [[implements]] Accesible {
    private boolean accesoEspecial;

    [[@Override]]
    public boolean tieneAccesoEspecial() { return [[accesoEspecial]]; }

    @Override
    public void otorgarAccesoEspecial() { accesoEspecial = [[true]]; }
}`),
      write('Escribe la interfaz `Revisable` con los métodos `boolean estaDisponibleRevision()` y `void marcarDisponibleRevision()`.', {
        starter: '',
        checks: [
          ['public interface Revisable{', 'public interface Revisable'],
          [['boolean estaDisponibleRevision();', 'public boolean estaDisponibleRevision();'], 'boolean estaDisponibleRevision();'],
          [['void marcarDisponibleRevision();', 'public void marcarDisponibleRevision();'], 'void marcarDisponibleRevision();'],
        ],
        solution: `public interface Revisable {
    boolean estaDisponibleRevision();
    void marcarDisponibleRevision();
}`,
      }),
      line('Escribe la primera línea de `Auto`, que hereda de `Vehiculo` e implementa `Revisable`.', {
        checks: [['public class Auto extends Vehiculo implements Revisable{', 'public class Auto extends Vehiculo implements Revisable {']],
        solution: 'public class Auto extends Vehiculo implements Revisable {',
      }),
      write('Implementa dentro de `Auto` el atributo `private boolean disponibleRevision` y los dos métodos de `Revisable`.', {
        starter: '',
        checks: [
          ['private boolean disponibleRevision;', 'private boolean disponibleRevision;'],
          ['public boolean estaDisponibleRevision(){', 'public boolean estaDisponibleRevision()'],
          [['return disponibleRevision;', 'return this.disponibleRevision;'], 'Retorna disponibleRevision'],
          ['public void marcarDisponibleRevision(){', 'public void marcarDisponibleRevision()'],
          [['disponibleRevision=true;', 'this.disponibleRevision=true;'], 'Asigna disponibleRevision = true'],
        ],
        solution: `private boolean disponibleRevision;

@Override
public boolean estaDisponibleRevision() {
    return disponibleRevision;
}

@Override
public void marcarDisponibleRevision() {
    disponibleRevision = true;
}`,
      }),
      out('¿Qué imprime? (Auto implementa Revisable, Camion no)',
        `Vehiculo v1 = new Auto("AA1111", 4, "Manual");
Vehiculo v2 = new Camion("BB2222", 8);
System.out.println(v1 instanceof Revisable);
System.out.println(v2 instanceof Revisable);
System.out.println(v2 instanceof Vehiculo);`,
        'true\nfalse\ntrue'),
    ]),

    level('Desafío: FitLife', '🏋️', [
      teoria('El molde de la prueba',
        'Caso **FitLife**: todos los clientes comparten `id`, `nombre` y `edad`. Los **regulares** agregan `clasesGrupales`; los **premium** agregan `plan` e implementan la interfaz `Accesible`.',
        `<table><tr><th>Clase</th><th>Costo base</th><th>Si...</th><th>Factor</th></tr>
<tr><td>ClienteRegular</td><td>20000</td><td>clasesGrupales</td><td>× 1.20</td></tr>
<tr><td>ClientePremium</td><td>35000</td><td>accesoEspecial</td><td>× 1.15</td></tr></table>
<div class="tip">📋 Orden recomendado: ① Interfaz → ② Padre → ③ Hijas → ④ Gestor → ⑤ Main</div>`),
      write('② Escribe la clase abstracta `Cliente` con `private int id`, `private String nombre`, `private int edad`, un constructor que use setters, y el método abstracto `calcularMembresia()` que retorna `double`.', {
        starter: '',
        checks: [
          ['public abstract class Cliente{', 'public abstract class Cliente'],
          ['private int id;', 'private int id;'],
          ['private String nombre;', 'private String nombre;'],
          ['private int edad;', 'private int edad;'],
          ['public Cliente(int id,String nombre,int edad){', 'public Cliente(int id, String nombre, int edad)'],
          [/setId\(id\);setNombre\(nombre\);setEdad\(edad\);/, 'El constructor llama a setId, setNombre y setEdad (en ese orden)'],
          ['public abstract double calcularMembresia();', 'public abstract double calcularMembresia();'],
        ],
        solution: `public abstract class Cliente {
    private int id;
    private String nombre;
    private int edad;

    public Cliente(int id, String nombre, int edad) {
        setId(id);
        setNombre(nombre);
        setEdad(edad);
    }

    public abstract double calcularMembresia();

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public int getEdad() { return edad; }

    public void setId(int id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEdad(int edad) {
        if (edad < 0) {
            throw new IllegalArgumentException("Edad inválida");
        }
        this.edad = edad;
    }
}`,
        hint: 'No olvides que los setters también deben existir (aunque aquí solo revisamos el constructor y el método abstracto).',
      }),
      write('③ Escribe `ClienteRegular extends Cliente` con `private boolean clasesGrupales`, su constructor (con `super` primero) y `calcularMembresia()`.', {
        starter: '',
        checks: [
          ['public class ClienteRegular extends Cliente{', 'public class ClienteRegular extends Cliente'],
          ['private boolean clasesGrupales;', 'private boolean clasesGrupales;'],
          [/public ClienteRegular\(int id,String nombre,int edad,boolean clasesGrupales\)\{super\(id,nombre,edad\);/, 'Constructor (int id, String nombre, int edad, boolean clasesGrupales) con super(id, nombre, edad) primero'],
          ['public double calcularMembresia(){', '@Override public double calcularMembresia()'],
          [/if\((this\.)?clasesGrupales\)|if\((this\.)?clasesGrupales==true\)/, 'if (clasesGrupales)'],
          ['return 20000*1.20;', 'return 20000 * 1.20;'],
          ['return 20000;', 'return 20000;'],
        ],
        solution: `public class ClienteRegular extends Cliente {
    private boolean clasesGrupales;

    public ClienteRegular(int id, String nombre, int edad, boolean clasesGrupales) {
        super(id, nombre, edad);
        this.clasesGrupales = clasesGrupales;
    }

    @Override
    public double calcularMembresia() {
        if (clasesGrupales) {
            return 20000 * 1.20;
        }
        return 20000;
    }
}`,
      }),
      write('③ Escribe `ClientePremium extends Cliente implements Accesible` con `private String plan`, `private boolean accesoEspecial`, constructor, `calcularMembresia()` (35000, ×1.15 si tiene acceso especial) y los métodos de `Accesible`.', {
        starter: '',
        checks: [
          ['public class ClientePremium extends Cliente implements Accesible{', 'extends Cliente implements Accesible'],
          ['private String plan;', 'private String plan;'],
          ['private boolean accesoEspecial;', 'private boolean accesoEspecial;'],
          [/public ClientePremium\(int id,String nombre,int edad,String plan\)\{super\(id,nombre,edad\);/, 'Constructor (int id, String nombre, int edad, String plan) con super primero'],
          [/if\((this\.)?accesoEspecial\)/, 'if (accesoEspecial)'],
          ['return 35000*1.15;', 'return 35000 * 1.15;'],
          ['return 35000;', 'return 35000;'],
          ['public boolean tieneAccesoEspecial(){', 'public boolean tieneAccesoEspecial()'],
          [['accesoEspecial=true;', 'this.accesoEspecial=true;'], 'otorgarAccesoEspecial pone accesoEspecial = true'],
        ],
        solution: `public class ClientePremium extends Cliente implements Accesible {
    private String plan;
    private boolean accesoEspecial;

    public ClientePremium(int id, String nombre, int edad, String plan) {
        super(id, nombre, edad);
        this.plan = plan;
    }

    @Override
    public double calcularMembresia() {
        if (accesoEspecial) {
            return 35000 * 1.15;
        }
        return 35000;
    }

    @Override
    public boolean tieneAccesoEspecial() {
        return accesoEspecial;
    }

    @Override
    public void otorgarAccesoEspecial() {
        accesoEspecial = true;
    }
}`,
      }),
      out('¿Qué imprime? (ojo con los decimales de double)',
        `Cliente c1 = new ClienteRegular(1, "Ana", 25, true);
ClientePremium c2 = new ClientePremium(2, "Luis", 30, "Gold");
System.out.println(c2.calcularMembresia());
c2.otorgarAccesoEspecial();
System.out.println(c1.calcularMembresia());`,
        '35000.0\n24000.0'),
    ], { boss: true }),
  ]),

  /* ======================= UNIDAD 8 ======================= */
  unit('Colecciones y Gestor', 'ArrayList, for-each y la clase Gestor de la prueba', 'blue', [
    level('ArrayList', '📚', [
      teoria('ArrayList',
        'Un `ArrayList` es una lista que **crece sola**. Se importa desde `java.util`.',
        c(`import java.util.ArrayList;

ArrayList<String> nombres = new ArrayList<>();
nombres.add("Ana");          // agregar
nombres.add("Pedro");
nombres.get(0);              // "Ana"   (índices desde 0)
nombres.size();              // 2
nombres.remove(0);           // elimina "Ana"
System.out.println(nombres); // [Pedro]

for (String n : nombres) {   // for-each: "por cada n en nombres"
    System.out.println(n);
}`),
        '<div class="warn">⚠️ Entre `< >` va una clase, no un primitivo: `ArrayList<Integer>`, no `ArrayList<int>`.</div>'),
      fill('Completa el uso de la lista.',
        `ArrayList<[[String]]> nombres = new ArrayList<>();
nombres.[[add]]("Ana");
System.out.println(nombres.[[size]]());
System.out.println(nombres.[[get]](0));`),
      line('Crea un `ArrayList` de `Cliente` llamado `clientes`.', {
        checks: [[['ArrayList<Cliente>clientes=new ArrayList<>();', 'ArrayList<Cliente>clientes=new ArrayList<Cliente>();', 'List<Cliente>clientes=new ArrayList<>();'], 'ArrayList<Cliente> clientes = new ArrayList<>();']],
        solution: 'ArrayList<Cliente> clientes = new ArrayList<>();',
      }),
      out('¿Qué imprime?',
        `ArrayList<String> lista = new ArrayList<>();
lista.add("A");
lista.add("B");
lista.add("C");
lista.remove(1);
System.out.println(lista);
System.out.println(lista.size());`,
        '[A, C]\n2'),
      write('Recorre la lista `nombres` con un **for-each** e imprime cada nombre.', {
        starter: `ArrayList<String> nombres = new ArrayList<>();
nombres.add("Ana");
nombres.add("Luis");
`,
        checks: [
          [/for\(String (\w+):nombres\)\{?System\.out\.println\(\1\);/, 'for (String n : nombres) { System.out.println(n); }'],
        ],
        solution: `ArrayList<String> nombres = new ArrayList<>();
nombres.add("Ana");
nombres.add("Luis");
for (String n : nombres) {
    System.out.println(n);
}`,
      }),
      out('¿Qué imprime?',
        `ArrayList<Integer> notas = new ArrayList<>();
notas.add(5);
notas.add(7);
notas.add(6);
int suma = 0;
for (int n : notas) {
    suma += n;
}
System.out.println("Suma: " + suma);
System.out.println("Promedio: " + suma / notas.size());`,
        'Suma: 18\nPromedio: 6'),
    ]),

    level('Clase Gestor', '🗂️', [
      teoria('El Gestor (molde ④)',
        'El **Gestor** administra una lista del tipo padre: registrar, buscar, listar y mostrar costos.',
        c(`import java.util.ArrayList;

public class Gimnasio {
    private ArrayList<Cliente> lista = new ArrayList<>();

    public void registrar(Cliente x) {
        lista.add(x);
        System.out.println("Registrado correctamente: " + x.getNombre());
    }

    public Cliente buscar(int id) {
        for (Cliente x : lista) {
            if (x.getId() == id) {
                return x;
            }
        }
        System.out.println("No se encontró: " + id);   // ← DESPUÉS del for
        return null;
    }

    public void listar() {
        for (Cliente x : lista) {
            System.out.println(x);
        }
    }
}`),
        '<div class="tip">Comparar: `int` → `x.getId() == id` · `String` → `x.getPatente().equals(patente)`</div>'),
      write('Escribe el método `registrar(Cliente x)` del gestor: agrega a `lista` e imprime `Registrado correctamente: ` + nombre.', {
        starter: '',
        checks: [
          ['public void registrar(Cliente x){', 'public void registrar(Cliente x)'],
          ['lista.add(x);', 'lista.add(x);'],
          ['System.out.println("Registrado correctamente: "+x.getNombre());', 'Imprime "Registrado correctamente: " + x.getNombre()'],
        ],
        solution: `public void registrar(Cliente x) {
    lista.add(x);
    System.out.println("Registrado correctamente: " + x.getNombre());
}`,
      }),
      write('Escribe `public Cliente buscar(int id)`: recorre la lista, retorna el cliente si coincide el id; si no lo encuentra imprime `No se encontró: ` + id y retorna null.', {
        starter: '',
        checks: [
          ['public Cliente buscar(int id){', 'public Cliente buscar(int id)'],
          [/for\(Cliente (\w+):lista\)\{?if\(\1\.getId\(\)==id\)\{?return \1;/, 'for-each con if (x.getId() == id) return x;'],
          [/\}System\.out\.println\("No se encontró: "\+id\);return null;\}$/, 'Después del for: imprime "No se encontró: " + id y return null'],
        ],
        solution: `public Cliente buscar(int id) {
    for (Cliente x : lista) {
        if (x.getId() == id) {
            return x;
        }
    }
    System.out.println("No se encontró: " + id);
    return null;
}`,
      }),
      fix('Este buscar por patente nunca encuentra nada. Los String se comparan con `.equals()`. Corrígelo.', {
        starter: `public Vehiculo buscar(String patente) {
    for (Vehiculo x : lista) {
        if (x.getPatente() == patente) {
            return x;
        }
    }
    System.out.println("No se encontró: " + patente);
    return null;
}`,
        checks: [
          [['x.getPatente().equals(patente)', 'patente.equals(x.getPatente())', 'x.getPatente().equalsIgnoreCase(patente)'], 'Usa x.getPatente().equals(patente)'],
          { not: '==patente', label: 'Quita la comparación con ==' },
        ],
        solution: `public Vehiculo buscar(String patente) {
    for (Vehiculo x : lista) {
        if (x.getPatente().equals(patente)) {
            return x;
        }
    }
    System.out.println("No se encontró: " + patente);
    return null;
}`,
      }),
      fix('Bug clásico: imprime "No se encontró" por cada elemento que no coincide. Saca el mensaje del for (y el else).', {
        starter: `public Cliente buscar(int id) {
    for (Cliente x : lista) {
        if (x.getId() == id) {
            return x;
        } else {
            System.out.println("No se encontró: " + id);
        }
    }
    return null;
}`,
        checks: [
          { not: 'else', label: 'Quita el else' },
          [/\}\}System\.out\.println\("No se encontró: "\+id\);return null;/, 'El mensaje va después del for, justo antes de return null'],
        ],
        solution: `public Cliente buscar(int id) {
    for (Cliente x : lista) {
        if (x.getId() == id) {
            return x;
        }
    }
    System.out.println("No se encontró: " + id);
    return null;
}`,
      }),
      write('Escribe `mostrarCostos()`: por cada cliente imprime `nombre: $costo` usando `getNombre()` y `calcularMembresia()`.', {
        starter: '',
        checks: [
          ['public void mostrarCostos(){', 'public void mostrarCostos()'],
          [/for\(Cliente (\w+):lista\)\{?System\.out\.println\(\1\.getNombre\(\)\+": \$"\+\1\.calcularMembresia\(\)\);/, 'for-each que imprima x.getNombre() + ": $" + x.calcularMembresia()'],
        ],
        solution: `public void mostrarCostos() {
    for (Cliente x : lista) {
        System.out.println(x.getNombre() + ": $" + x.calcularMembresia());
    }
}`,
      }),
    ]),

    level('El Main final', '🏁', [
      teoria('Main (molde ⑤)',
        c(`public class Main {
    public static void main(String[] args) {
        Gimnasio g = new Gimnasio();

        ClienteRegular c1 = new ClienteRegular(1, "Ana", 25, true);
        ClientePremium c2 = new ClientePremium(2, "Luis", 30, "Gold");
        c2.otorgarAccesoEspecial();       // "una vez creado..."

        g.registrar(c1);
        g.registrar(c2);

        System.out.println(g.buscar(1));  // existe
        g.buscar(99);                     // no existe
        g.listar();
        g.mostrarCostos();
    }
}`)),
      write('Escribe el main: crea `Gimnasio g`, un `ClienteRegular c1` (1, "Ana", 25, true), regístralo, búscalo por id 1 y busca el id 99.', {
        starter: `public class Main {
    public static void main(String[] args) {

    }
}`,
        checks: [
          ['Gimnasio g=new Gimnasio();', 'Gimnasio g = new Gimnasio();'],
          [/(ClienteRegular|Cliente) c1=new ClienteRegular\(1,"Ana",25,true\);/, 'ClienteRegular c1 = new ClienteRegular(1, "Ana", 25, true);'],
          ['g.registrar(c1);', 'g.registrar(c1);'],
          ['g.buscar(1)', 'Busca el id 1'],
          ['g.buscar(99);', 'Busca el id 99'],
        ],
        solution: `public class Main {
    public static void main(String[] args) {
        Gimnasio g = new Gimnasio();
        ClienteRegular c1 = new ClienteRegular(1, "Ana", 25, true);
        g.registrar(c1);
        System.out.println(g.buscar(1));
        g.buscar(99);
    }
}`,
      }),
      out('Con el Gimnasio de la teoría (toString de Cliente retorna `Cliente: ` + nombre), ¿qué imprime?',
        `Gimnasio g = new Gimnasio();
g.registrar(new ClienteRegular(1, "Ana", 25, false));
g.registrar(new ClientePremium(2, "Luis", 30, "Gold"));
System.out.println(g.buscar(2));
g.buscar(7);
g.mostrarCostos();`,
        'Registrado correctamente: Ana\nRegistrado correctamente: Luis\nCliente: Luis\nNo se encontró: 7\nAna: $20000.0\nLuis: $35000.0'),
      fill('Repaso express del molde completo.',
        `public [[abstract]] class Vehiculo { ... }
public class Auto [[extends]] Vehiculo [[implements]] Revisable { ... }
private ArrayList<[[Vehiculo]]> lista = new ArrayList<>();
if (x.getPatente().[[equals]](patente)) { return x; }`),
    ]),
  ]),
];
