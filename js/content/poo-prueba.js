import { c, teoria, fill, line, write, fix, out, level, unit } from './helpers.js';

// Unidad especial: el método de la Prueba 1 (Resumen_Prueba) practicado con un caso nuevo.

const ENUNCIADO = `<div class="hint-box" style="background:transparent;border-color:var(--blue)">
<b>📄 Caso: Clínica PetCare</b>
<p style="margin:6px 0">La clínica necesita un sistema para sus pacientes. <b>Todos los pacientes comparten</b> un código (entero, mayor que 0), un nombre (texto, no nulo ni vacío) y una edad (entero, mayor o igual a 0).</p>
<p style="margin:6px 0"><b>Los perros agregan</b> su peso (con decimales, mayor que 0). <b>Los gatos agregan</b> un indicador de si salen al exterior.</p>
<p style="margin:6px 0">La consulta de un perro tiene un <b>costo base</b> de $15.000 y <b>se incrementa un 30%</b> si el peso <b>supera</b> 20 kg. La de un gato tiene un costo base de $12.000 y se incrementa un 20% si sale al exterior.</p>
<p style="margin:6px 0"><b>Solo los gatos</b> implementan la <b>interfaz</b> Vacunable, que permite <b>consultar si</b> está vacunado y <b>registrar que</b> fue vacunado.</p>
<p style="margin:6px 0">Cree la clase <b>gestora</b> Clinica que permita registrar, <b>buscar por código</b>, listar y mostrar el costo de cada consulta. El toString debe mostrar <b>únicamente</b> el código y el nombre: <code>Paciente: 1 - Rocky</code>.</p>
<table style="font-size:14px;border-collapse:collapse;margin:6px 0"><tr><th>Tipo</th><th>Código</th><th>Nombre</th><th>Edad</th><th>Peso / Exterior</th></tr>
<tr><td>Perro</td><td>1</td><td>Rocky</td><td>5</td><td>25.5</td></tr>
<tr><td>Perro</td><td>2</td><td>Toby</td><td>2</td><td>8.0</td></tr>
<tr><td>Gato</td><td>3</td><td>Luna</td><td>3</td><td>true</td></tr></table>
Una vez creada, registre que Luna fue vacunada.</div>`;

const PETCARE_MAIN = `public class Main {
    public static void main(String[] args) {
        Clinica g = new Clinica();
        Perro rocky = new Perro(1, "Rocky", 5, 25.5);
        Perro toby = new Perro(2, "Toby", 2, 8.0);
        Gato luna = new Gato(3, "Luna", 3, true);
        luna.registrarVacuna();
        g.registrar(rocky);
        g.registrar(toby);
        g.registrar(luna);
        System.out.println(g.buscar(3));
        g.buscar(9);
        g.listar();
        g.mostrarCostos();
    }
}`;

const prueba = unit('Prueba 1: el método paso a paso', 'Tu resumen de la prueba convertido en un método que se practica', 'yellow', [
  level('Cómo enfrentar la prueba', '📋', [
    teoria('El método en 4 pasos',
      'La prueba siempre tiene la misma forma: un **enunciado** con una clase base, dos hijas, una interfaz, un gestor y una tabla de datos para el main. No se improvisa: se sigue un método.',
      `<table><tr><th>Paso</th><th>Qué haces</th><th>Tiempo sugerido (90 min)</th></tr>
<tr><td>1</td><td>Leer el enunciado y <b>llenar la tabla</b> de corchetes (con lápiz, antes de tocar el PC)</td><td>10 min</td></tr>
<tr><td>2</td><td>Escribir los <b>moldes en orden</b>: ① interfaz → ② padre → ③ hijas → ④ gestor → ⑤ main</td><td>55 min</td></tr>
<tr><td>3</td><td>Usar la <b>tabla de datos</b> para tipos, validaciones y factores</td><td>(durante el paso 2)</td></tr>
<tr><td>4</td><td><b>Ejecutar</b>, comparar con tu cálculo a mano y <b>exportar el ZIP</b></td><td>15 min + 10 de revisión</td></tr></table>
<div class="tip">📝 Regla de oro: lo que está entre <b>[CORCHETES]</b> se cambia según el enunciado. <b>Todo lo demás se copia igual.</b></div>
<div class="warn">⚠️ Si te quedas pegado en algo, sigue con el siguiente molde. Un programa que compila con un método a medias vale más que uno perfecto que no compila.</div>`),
    teoria('Paso 1: la tabla del enunciado',
      'Antes de programar, busca estas frases en el enunciado y anota qué va en cada corchete:',
      `<table><tr><th>Corchete</th><th>Lo busco en la frase…</th><th>FitLife (Prueba 1)</th><th>Transportes Veloz</th></tr>
<tr><td>[Padre]</td><td>"clase base", "todos comparten"</td><td>Cliente</td><td>Vehiculo</td></tr>
<tr><td>[tipo] [atrib] del padre</td><td>"todos comparten …"</td><td>int id, String nombre, int edad</td><td>String patente, int anio, int kilometraje</td></tr>
<tr><td>[Hija] + [propio]</td><td>"los ___ agregan …"</td><td>ClienteRegular: boolean clasesGrupales<br>ClientePremium: String plan</td><td>Camion: double capacidadCarga<br>Auto: int numeroPuertas, String tipoTransmision</td></tr>
<tr><td>[BASE] [FACTOR]</td><td>"costo base …", "se incrementa …%"</td><td>20000 · 1.20 / 35000 · 1.15</td><td>100000 · 1.30 / 50000 · 1.15</td></tr>
<tr><td>[condición]</td><td>"si …" (lo que sube el precio)</td><td>clasesGrupales / accesoEspecial</td><td>capacidadCarga > 10 / "Manual"</td></tr>
<tr><td>[Interfaz]</td><td>"interfaz ___", "contrato"</td><td>Accesible (solo Premium)</td><td>Revisable (solo Auto)</td></tr>
<tr><td>[consultar] [registrar] [bool]</td><td>"consultar si…" / "registrar que…"</td><td>tieneAccesoEspecial / otorgarAccesoEspecial / accesoEspecial</td><td>estaDisponibleRevision / marcarDisponibleRevision / disponibleRevision</td></tr>
<tr><td>[calcular]</td><td>"calcular el valor / costo …"</td><td>calcularMembresia</td><td>calcularCostoMantenimiento</td></tr>
<tr><td>[Gestor] [clave]</td><td>"gestor", "buscar … por ___"</td><td>Gimnasio · int id</td><td>Empresa · String patente</td></tr></table>`),
    teoria('Paso 3: la tabla de datos',
      `<table><tr><th>El enunciado dice…</th><th>[tipo]</th></tr>
<tr><td>"indicador", "indica si"</td><td>\`boolean\`</td></tr>
<tr><td>"número de", "año", "código"</td><td>\`int\`</td></tr>
<tr><td>"con decimales" (12.5)</td><td>\`double\`</td></tr>
<tr><td>texto</td><td>\`String\`</td></tr></table>
<table><tr><th>Regla del enunciado</th><th>[dato malo] (lo contrario) → throw</th></tr>
<tr><td>"mayor que 0"</td><td>\`x <= 0\`</td></tr>
<tr><td>"mayor o igual a 0"</td><td>\`x < 0\`</td></tr>
<tr><td>"entre A y B"</td><td>\`x < A || x > B\`</td></tr>
<tr><td>"no nulo ni vacío"</td><td>\`x == null || x.isEmpty()\`</td></tr></table>
<table><tr><th>Porcentaje</th><th>[FACTOR]</th></tr>
<tr><td>+20%</td><td>\`1.20\`</td></tr><tr><td>+15%</td><td>\`1.15\`</td></tr><tr><td>+30%</td><td>\`1.30\`</td></tr><tr><td>−10%</td><td>\`0.90\`</td></tr></table>
<div class="tip">"supera 10" → \`> 10\` · "10 o más" → \`>= 10\` · String se compara con \`.equals()\`, nunca con \`==\`</div>`),
    teoria('El caso para practicar', 'En esta unidad vas a resolver una prueba **nueva**, con el mismo formato de la tuya, paso a paso:', ENUNCIADO),
    fill(`Paso 1 con el caso PetCare: llena la tabla. ${ENUNCIADO}`,
      `[Padre]            → [[Paciente]]
[atrib] del padre  → int codigo, String nombre, int [[edad]]
[Hija] + [propio]  → Perro: [[double]] peso
                     Gato: [[boolean]] exterior
[Interfaz]         → [[Vacunable]]   (solo en [[Gato]])
[Gestor] [clave]   → [[Clinica]] · int [[codigo]]`, { lang: 'text', explain: '"con decimales" → double · "indicador de si" → boolean · "buscar por código" → la clave del gestor.' }),
    fill(`Sigue con los precios y la interfaz. ${ENUNCIADO}`,
      `Perro → [BASE] [[15000]]  [FACTOR] [[1.30|1.3]]  [condición] peso [[>]] 20
Gato  → [BASE] [[12000]]  [FACTOR] [[1.20|1.2]]  [condición] [[exterior]]
[consultar] [[estaVacunado]]   [registrar] [[registrarVacuna]]   [bool] [[vacunado]]
[calcular] [[calcularConsulta]]`, { lang: 'text', explain: '"supera 20" es estrictamente mayor: `> 20`. Los nombres de los métodos salen de los verbos del enunciado.' }),
    fill('Paso 3: traduce cada regla del enunciado a su "dato malo" o factor.',
      `"mayor que 0"        → if (codigo [[<=]] 0)
"mayor o igual a 0"  → if (edad [[<]] 0)
"no nulo ni vacío"   → if (nombre [[==]] null || nombre.[[isEmpty]]())
"supera 20"          → peso [[>]] 20
"20 o más"           → peso [[>=]] 20
"se incrementa 15%"  → [[1.15]]
"descuento de 10%"   → [[0.90|0.9]]`),
    line('Convierte la fila `| Gato | 3 | Luna | 3 | true |` en la línea del main (variable `luna`).', {
      checks: [[/Gato luna=new Gato\(3,"Luna",3,true\);/, 'Gato luna = new Gato(3, "Luna", 3, true);']],
      solution: 'Gato luna = new Gato(3, "Luna", 3, true);',
      explain: 'Texto con comillas · números y true/false sin comillas · mismo orden que el constructor.',
    }),
  ]),

  level('① Interfaz y ② Padre', '🧱', [
    teoria('Moldes ① y ②',
      c(`// ① Interfaz
public interface [Interfaz] {
    boolean [consultar]();
    void [registrar]();
}

// ② Padre
public abstract class [Padre] {
    private [tipo] [atrib];                       // ↻ por cada atributo

    public [Padre]([tipo] [atrib], ...) {
        set[Atrib]([atrib]);                      // ↻ nunca this.x = x
    }

    public abstract double [calcular]();

    public [tipo] get[Atrib]() { return [atrib]; }      // ↻

    public void set[Atrib]([tipo] [atrib]) {            // ↻
        if ([dato malo]) {
            throw new IllegalArgumentException("[mensaje]");
        }
        this.[atrib] = [atrib];
    }

    @Override
    public String toString() {
        return "[Texto]: " + [atrib] + ...;     // solo lo que diga "únicamente"
    }
}`),
      '<div class="tip">`set[Atrib]` = "set" + nombre con mayúscula: `edad` → `setEdad`. Si el enunciado no da regla para un atributo, su setter va **sin if**.</div>'),
    write(`① Escribe la interfaz del caso PetCare. ${ENUNCIADO}`, {
      starter: '',
      checks: [
        ['public interface Vacunable{', 'public interface Vacunable'],
        [['boolean estaVacunado();', 'public boolean estaVacunado();'], 'boolean estaVacunado();'],
        [['void registrarVacuna();', 'public void registrarVacuna();'], 'void registrarVacuna();'],
      ],
      solution: `public interface Vacunable {
    boolean estaVacunado();
    void registrarVacuna();
}`,
    }),
    write('② Escribe el inicio de la clase padre: `abstract`, los 3 atributos privados, el constructor **usando setters** y el método abstracto `calcularConsulta()`.', {
      starter: '',
      checks: [
        ['public abstract class Paciente{', 'public abstract class Paciente'],
        ['private int codigo;', 'private int codigo;'],
        ['private String nombre;', 'private String nombre;'],
        ['private int edad;', 'private int edad;'],
        ['public Paciente(int codigo,String nombre,int edad){', 'public Paciente(int codigo, String nombre, int edad)'],
        [/\{setCodigo\(codigo\);setNombre\(nombre\);setEdad\(edad\);\}/, 'Dentro del constructor: setCodigo, setNombre y setEdad'],
        ['public abstract double calcularConsulta();', 'public abstract double calcularConsulta();'],
        { not: 'this.edad=edad;}public abstract', label: 'No uses this.x = x dentro del constructor' },
      ],
      solution: `public abstract class Paciente {
    private int codigo;
    private String nombre;
    private int edad;

    public Paciente(int codigo, String nombre, int edad) {
        setCodigo(codigo);
        setNombre(nombre);
        setEdad(edad);
    }

    public abstract double calcularConsulta();
}`,
    }),
    write('② Escribe los setters con validación de `codigo` ("mayor que 0") y `edad` ("mayor o igual a 0"). El mensaje del error lo eliges tú.', {
      starter: '',
      checks: [
        ['public void setCodigo(int codigo){', 'public void setCodigo(int codigo)'],
        ['if(codigo<=0){', 'Dato malo del código: if (codigo <= 0)'],
        ['public void setEdad(int edad){', 'public void setEdad(int edad)'],
        ['if(edad<0){', 'Dato malo de la edad: if (edad < 0)'],
        [/throw new IllegalArgumentException\(".+"\);[\s\S]*throw new IllegalArgumentException\(".+"\);/, 'throw new IllegalArgumentException("...") en ambos'],
        ['this.codigo=codigo;', 'this.codigo = codigo; después del if'],
        ['this.edad=edad;', 'this.edad = edad; después del if'],
      ],
      solution: `public void setCodigo(int codigo) {
    if (codigo <= 0) {
        throw new IllegalArgumentException("El código debe ser mayor que 0");
    }
    this.codigo = codigo;
}

public void setEdad(int edad) {
    if (edad < 0) {
        throw new IllegalArgumentException("La edad no puede ser negativa");
    }
    this.edad = edad;
}`,
    }),
    write('② Escribe `setNombre` ("no nulo ni vacío").', {
      starter: '',
      checks: [
        ['public void setNombre(String nombre){', 'public void setNombre(String nombre)'],
        [['if(nombre==null||nombre.isEmpty()){', 'if(nombre==null||nombre.trim().isEmpty()){', 'if(nombre==null||nombre.isBlank()){'], 'if (nombre == null || nombre.isEmpty())'],
        [/throw new IllegalArgumentException\(".+"\);/, 'throw new IllegalArgumentException("...")'],
        ['this.nombre=nombre;', 'this.nombre = nombre;'],
      ],
      solution: `public void setNombre(String nombre) {
    if (nombre == null || nombre.isEmpty()) {
        throw new IllegalArgumentException("El nombre es obligatorio");
    }
    this.nombre = nombre;
}`,
      explain: 'El orden importa: primero `nombre == null`. Si nombre fuera null y preguntaras primero `isEmpty()`, se caería.',
    }),
    write('② Escribe el `toString()` que muestre **únicamente** el código y el nombre: `Paciente: 1 - Rocky`.', {
      starter: '',
      checks: [
        ['@Override', '@Override'],
        ['public String toString(){', 'public String toString()'],
        [/return "Paciente: "\+(this\.)?codigo\+" - "\+(this\.)?nombre;/, 'return "Paciente: " + codigo + " - " + nombre;'],
      ],
      solution: `@Override
public String toString() {
    return "Paciente: " + codigo + " - " + nombre;
}`,
      explain: '"Únicamente" significa que si agregas la edad, te descuentan. Copia el formato exacto del enunciado.',
    }),
  ]),

  level('③ Las hijas', '🐾', [
    teoria('Molde ③',
      c(`public class [Hija] extends [Padre] implements [Interfaz] {   // implements solo si lo dice
    private [tipo] [propio];          // ↻ solo lo que "agregan"
    private boolean [bool];           // solo con interfaz

    public [Hija]([datos padre], [tipo] [propio]) {
        super([datos padre]);         // SIEMPRE primera línea
        set[Propio]([propio]);
    }

    @Override
    public double [calcular]() {
        if ([condición]) {
            return [BASE] * [FACTOR];
        }
        return [BASE];
    }

    @Override
    public boolean [consultar]() { return [bool]; }    // solo con interfaz

    @Override
    public void [registrar]() { [bool] = true; }      // solo con interfaz

    // + get/set de [propio] igual que en el padre

    @Override
    public String toString() { return super.toString(); }
}`),
      `<div class="tip">[condición] según el tipo: \`boolean\` → \`if (exterior)\` · \`String\` → \`if (tipo.equals("Manual"))\` · número → \`if (peso > 20)\`</div>
<div class="tip">[datos padre] = los mismos parámetros del constructor del padre, en el mismo orden.</div>`),
    write(`③ Escribe la clase \`Perro\` (sin getters/setters: solo atributo, constructor y \`calcularConsulta\`). ${ENUNCIADO}`, {
      starter: '',
      checks: [
        ['public class Perro extends Paciente{', 'public class Perro extends Paciente (sin implements: la interfaz es solo de gatos)'],
        ['private double peso;', 'private double peso;'],
        [/public Perro\(int codigo,String nombre,int edad,double peso\)\{super\(codigo,nombre,edad\);/, 'Constructor (int codigo, String nombre, int edad, double peso) con super(codigo, nombre, edad) primero'],
        [/(setPeso\(peso\)|this\.peso=peso);/, 'Guarda el peso (setPeso(peso))'],
        ['@Override', '@Override'],
        ['public double calcularConsulta(){', 'public double calcularConsulta()'],
        ['if(peso>20){return 15000*1.30;}', 'if (peso > 20) { return 15000 * 1.30; }'],
        ['return 15000;', 'return 15000;'],
      ],
      solution: `public class Perro extends Paciente {
    private double peso;

    public Perro(int codigo, String nombre, int edad, double peso) {
        super(codigo, nombre, edad);
        setPeso(peso);
    }

    @Override
    public double calcularConsulta() {
        if (peso > 20) {
            return 15000 * 1.30;
        }
        return 15000;
    }
}`,
    }),
    write(`③ Escribe la clase \`Gato\`: hereda, implementa la interfaz, su constructor, \`calcularConsulta\` y los 2 métodos de \`Vacunable\`. ${ENUNCIADO}`, {
      starter: '',
      checks: [
        ['public class Gato extends Paciente implements Vacunable{', 'public class Gato extends Paciente implements Vacunable'],
        ['private boolean exterior;', 'private boolean exterior;'],
        ['private boolean vacunado;', 'private boolean vacunado; (el [bool] de la interfaz)'],
        [/public Gato\(int codigo,String nombre,int edad,boolean exterior\)\{super\(codigo,nombre,edad\);/, 'Constructor con super(codigo, nombre, edad) primero'],
        ['if(exterior){return 12000*1.20;}', 'if (exterior) { return 12000 * 1.20; }'],
        ['return 12000;', 'return 12000;'],
        [/public boolean estaVacunado\(\)\{return (this\.)?vacunado;\}/, 'estaVacunado() retorna vacunado'],
        [/public void registrarVacuna\(\)\{(this\.)?vacunado=true;\}/, 'registrarVacuna() pone vacunado = true'],
      ],
      solution: `public class Gato extends Paciente implements Vacunable {
    private boolean exterior;
    private boolean vacunado;

    public Gato(int codigo, String nombre, int edad, boolean exterior) {
        super(codigo, nombre, edad);
        setExterior(exterior);
    }

    @Override
    public double calcularConsulta() {
        if (exterior) {
            return 12000 * 1.20;
        }
        return 12000;
    }

    @Override
    public boolean estaVacunado() {
        return vacunado;
    }

    @Override
    public void registrarVacuna() {
        vacunado = true;
    }
}`,
    }),
    fix('"Solo los gatos implementan Vacunable", pero esta versión se la puso también al perro. Corrígela.', {
      starter: `public class Perro extends Paciente implements Vacunable {
    private double peso;
}`,
      checks: [
        ['public class Perro extends Paciente{', 'public class Perro extends Paciente'],
        { not: 'implements', label: 'Quita el implements' },
      ],
      solution: `public class Perro extends Paciente {
    private double peso;
}`,
    }),
    fix('Error "missing return statement". Al método le falta un camino. Corrígelo.', {
      starter: `@Override
public double calcularConsulta() {
    if (exterior) {
        return 12000 * 1.20;
    }
}`,
      checks: [[/\}return 12000(\.0)?;\}$/, 'Después del if: return 12000;']],
      solution: `@Override
public double calcularConsulta() {
    if (exterior) {
        return 12000 * 1.20;
    }
    return 12000;
}`,
      explain: 'Si la condición es falsa, el método igual tiene que retornar el costo base.',
    }),
    out('Con las clases que escribiste, ¿qué imprime?',
      `Perro rocky = new Perro(1, "Rocky", 5, 25.5);
Perro toby = new Perro(2, "Toby", 2, 8.0);
Gato luna = new Gato(3, "Luna", 3, true);
System.out.println(rocky.calcularConsulta());
System.out.println(toby.calcularConsulta());
System.out.println(luna.calcularConsulta());`,
      '19500.0\n15000.0\n14400.0', { explain: 'Rocky pesa más de 20 → 15000 × 1.30. Toby no → base. Luna sale al exterior → 12000 × 1.20. Como el método retorna double, se imprime con .0' }),
  ]),

  level('④ Gestor y ⑤ Main', '🗂️', [
    teoria('Moldes ④ y ⑤',
      c(`import java.util.ArrayList;

public class [Gestor] {
    private ArrayList<[Padre]> lista = new ArrayList<>();

    public void registrar([Padre] x) {
        lista.add(x);
        System.out.println("Registrado correctamente: " + x.get[Nombre]());
    }

    public [Padre] buscar([tipo] [clave]) {
        for ([Padre] x : lista) {
            if ([comparar]) {
                return x;
            }
        }
        System.out.println("No se encontró: " + [clave]);   // DESPUÉS del for
        return null;
    }

    public void listar() {
        for ([Padre] x : lista) {
            System.out.println(x);
        }
    }

    public void mostrarCostos() {
        for ([Padre] x : lista) {
            System.out.println(x.get[Nombre]() + ": $" + x.[calcular]());
        }
    }
}`),
      c(`public class Main {
    public static void main(String[] args) {
        [Gestor] g = new [Gestor]();
        [Hija] [obj] = new [Hija]([datos de la fila]);   // ↻ una por fila
        [obj].[registrar]();                            // "una vez creado..."
        g.registrar([obj]);                              // ↻ uno por objeto
        System.out.println(g.buscar([clave que existe]));
        g.buscar([clave que NO existe]);
        g.listar();
        g.mostrarCostos();
    }
}`),
      '<div class="tip">[comparar]: `int` → `x.getCodigo() == codigo` · `String` → `x.getPatente().equals(patente)`</div>'),
    write('④ Escribe en `Clinica` el atributo `lista`, `registrar` y `buscar` (por código).', {
      starter: `import java.util.ArrayList;

public class Clinica {

}`,
      checks: [
        [['private ArrayList<Paciente>lista=new ArrayList<>();', 'private ArrayList<Paciente>lista=new ArrayList<Paciente>();'], 'private ArrayList<Paciente> lista = new ArrayList<>();'],
        ['public void registrar(Paciente x){lista.add(x);', 'registrar(Paciente x) agrega a la lista'],
        ['System.out.println("Registrado correctamente: "+x.getNombre());', 'Imprime "Registrado correctamente: " + x.getNombre()'],
        ['public Paciente buscar(int codigo){', 'public Paciente buscar(int codigo)'],
        [/for\(Paciente (\w+):lista\)\{?if\(\1\.getCodigo\(\)==codigo\)\{?return \1;/, 'for-each con if (x.getCodigo() == codigo) return x;'],
        [/\}System\.out\.println\("No se encontró: "\+codigo\);return null;/, 'Después del for: "No se encontró: " + codigo y return null'],
      ],
      solution: `import java.util.ArrayList;

public class Clinica {
    private ArrayList<Paciente> lista = new ArrayList<>();

    public void registrar(Paciente x) {
        lista.add(x);
        System.out.println("Registrado correctamente: " + x.getNombre());
    }

    public Paciente buscar(int codigo) {
        for (Paciente x : lista) {
            if (x.getCodigo() == codigo) {
                return x;
            }
        }
        System.out.println("No se encontró: " + codigo);
        return null;
    }
}`,
    }),
    write('④ Escribe `listar()` y `mostrarCostos()` de `Clinica`.', {
      starter: '',
      checks: [
        ['public void listar(){', 'public void listar()'],
        [/for\(Paciente (\w+):lista\)\{?System\.out\.println\(\1\);/, 'listar imprime cada paciente (usa su toString)'],
        ['public void mostrarCostos(){', 'public void mostrarCostos()'],
        [/for\(Paciente (\w+):lista\)\{?System\.out\.println\(\1\.getNombre\(\)\+": \$"\+\1\.calcularConsulta\(\)\);/, 'x.getNombre() + ": $" + x.calcularConsulta()'],
      ],
      solution: `public void listar() {
    for (Paciente x : lista) {
        System.out.println(x);
    }
}

public void mostrarCostos() {
    for (Paciente x : lista) {
        System.out.println(x.getNombre() + ": $" + x.calcularConsulta());
    }
}`,
    }),
    write(`⑤ Escribe el \`main\` completo a partir de la tabla. ${ENUNCIADO}`, {
      starter: `public class Main {
    public static void main(String[] args) {

    }
}`,
      checks: [
        ['Clinica g=new Clinica();', 'Clinica g = new Clinica();'],
        [/new Perro\(1,"Rocky",5,25\.5\);/, 'Fila 1: new Perro(1, "Rocky", 5, 25.5)'],
        [/new Perro\(2,"Toby",2,8(\.0)?\);/, 'Fila 2: new Perro(2, "Toby", 2, 8.0)'],
        [/Gato (\w+)=new Gato\(3,"Luna",3,true\);/, 'Fila 3: Gato luna = new Gato(3, "Luna", 3, true)'],
        [/(\w+)\.registrarVacuna\(\);/, '"Una vez creada": luna.registrarVacuna();'],
        [/(g\.registrar\(\w+\);){3}|g\.registrar\(\w+\);.*g\.registrar\(\w+\);.*g\.registrar\(\w+\);/, 'Registra los 3 en el gestor'],
        [/System\.out\.println\(g\.buscar\([123]\)\);/, 'Imprime la búsqueda de un código que existe'],
        [/g\.buscar\(([4-9]|\d\d+)\);/, 'Busca un código que NO existe'],
        ['g.listar();', 'g.listar();'],
        ['g.mostrarCostos();', 'g.mostrarCostos();'],
      ],
      solution: PETCARE_MAIN,
    }),
    out('Corre el main del ejercicio anterior en tu cabeza (o en IntelliJ). ¿Qué imprime?',
      PETCARE_MAIN.split('\n').slice(2, -2).map((l) => l.replace(/^ {8}/, '')).join('\n'),
      'Registrado correctamente: Rocky\nRegistrado correctamente: Toby\nRegistrado correctamente: Luna\nPaciente: 3 - Luna\nNo se encontró: 9\nPaciente: 1 - Rocky\nPaciente: 2 - Toby\nPaciente: 3 - Luna\nRocky: $19500.0\nToby: $15000.0\nLuna: $14400.0',
      { explain: 'Esto es exactamente lo que tienes que ver en la consola. Si tus números dan igual que tu cálculo a mano, está listo para entregar.' }),
  ]),

  level('Errores que bajan puntos', '🚑', [
    teoria('Checklist antes de entregar',
      `<ul>
<li>☐ ¿Compila? (nada subrayado en rojo en IntelliJ)</li>
<li>☐ ¿El constructor del padre usa <b>setters</b> y no \`this.x = x\`?</li>
<li>☐ ¿Cada setter con regla tiene su \`if\` + \`throw new IllegalArgumentException\`?</li>
<li>☐ ¿\`super(...)\` es la <b>primera línea</b> en cada hija?</li>
<li>☐ ¿\`implements\` <b>solo</b> en la hija que dice el enunciado?</li>
<li>☐ ¿Los String se comparan con \`.equals()\`?</li>
<li>☐ ¿"No se encontró" está <b>después</b> del for?</li>
<li>☐ ¿El toString muestra <b>únicamente</b> lo pedido?</li>
<li>☐ ¿Los \`new\` del main respetan el <b>orden del constructor</b>?</li>
<li>☐ ¿Los costos de la consola coinciden con tu cálculo a mano?</li>
</ul>`,
      `<table><tr><th>IntelliJ IDEA</th><th>Hace</th></tr>
<tr><td><b>Alt + Insert</b></td><td>Genera constructor, getters/setters y toString (el menú "Generate")</td></tr>
<tr><td><b>Ctrl + I</b></td><td>Implementa los métodos de la interfaz / abstractos</td></tr>
<tr><td><b>Ctrl + O</b></td><td>Sobrescribe un método del padre (pone el @Override solo)</td></tr>
<tr><td><b>Alt + Enter</b></td><td>"Arréglalo por mí": sobre algo en rojo te ofrece la solución (importar, implementar, crear…)</td></tr>
<tr><td><b>▶ verde</b> junto a <code>main</code> (o <b>Shift + F10</b>)</td><td>Ejecuta el programa</td></tr>
<tr><td><b>Ctrl + Alt + L</b></td><td>Ordena la indentación del código</td></tr>
<tr><td>File → Export → <b>Project to Zip File</b></td><td>Genera <code>Nombre_Apellido.zip</code> para subir a AVA</td></tr></table>
<div class="warn">⚠️ En IntelliJ <b>Shift + F6 es "Renombrar"</b>, no ejecutar (en NetBeans era distinto). Si tu versión no tiene "Project to Zip File", cierra IntelliJ, ve a la carpeta del proyecto en Windows → clic derecho → <b>Comprimir en archivo ZIP</b>.</div>`),
    fix('El main no compila: la fila era `| Auto | ABCD12 | 2020 | 45000 | 4 | Manual |` y el constructor es `Auto(String patente, int anio, int kilometraje, int numeroPuertas, String tipoTransmision)`.', {
      starter: `Auto a1 = new Auto("ABCD12", 2020, 45000, "Manual", 4);`,
      checks: [['Auto a1=new Auto("ABCD12",2020,45000,4,"Manual");', 'new Auto("ABCD12", 2020, 45000, 4, "Manual") en el orden del constructor']],
      solution: `Auto a1 = new Auto("ABCD12", 2020, 45000, 4, "Manual");`,
    }),
    fix('El enunciado pedía mostrar **únicamente** la patente y el año. Corrige el toString.', {
      starter: `@Override
public String toString() {
    return "Vehículo: " + patente + ", " + anio + ", " + kilometraje + " km";
}`,
      checks: [
        { not: 'kilometraje', label: 'Quita el kilometraje' },
        [/return ".*"\+patente\+".*"\+anio;/, 'Muestra solo patente y año'],
      ],
      solution: `@Override
public String toString() {
    return "Vehículo: " + patente + ", " + anio;
}`,
    }),
    fix('Este padre "funciona", pero acepta edades negativas aunque el setter las valida. ¿Por qué? Corrígelo.', {
      starter: `public Cliente(int id, String nombre, int edad) {
    this.id = id;
    this.nombre = nombre;
    this.edad = edad;
}`,
      checks: [
        [/\{(this\.)?setId\(id\);(this\.)?setNombre\(nombre\);(this\.)?setEdad\(edad\);\}/, 'Usa setId, setNombre y setEdad'],
        { not: 'this.edad=edad;', label: 'Nada de this.x = x en el constructor' },
      ],
      solution: `public Cliente(int id, String nombre, int edad) {
    setId(id);
    setNombre(nombre);
    setEdad(edad);
}`,
      explain: 'Con `this.edad = edad` el constructor se salta la validación del setter. Por eso el molde dice "nunca this.x = x".',
    }),
    fix('El costo de los autos manuales siempre sale como automático. Corrige la condición.', {
      starter: `@Override
public double calcularCostoMantenimiento() {
    if (tipoTransmision == "Manual") {
        return 50000 * 1.15;
    }
    return 50000;
}`,
      checks: [
        [['tipoTransmision.equals("Manual")', '"Manual".equals(tipoTransmision)'], 'Usa .equals("Manual")'],
        { not: '=="Manual"', label: 'Quita el ==' },
      ],
      solution: `@Override
public double calcularCostoMantenimiento() {
    if (tipoTransmision.equals("Manual")) {
        return 50000 * 1.15;
    }
    return 50000;
}`,
    }),
    fill('Paso 4: IntelliJ y entrega. Escribe el atajo de cada acción.',
      `// Generar constructor, getters/setters y toString:  [[Alt+Insert]]
// Implementar los métodos de la interfaz:            [[Ctrl+I]]
// Arreglar lo que está en rojo (sugerencias):        [[Alt+Enter]]
// Ejecutar el programa:                              [[Shift+F10]]
// Entregar: File → Export → Project to [[Zip]] File → Nombre_Apellido.zip → subir a AVA`, { lang: 'text', explain: 'Ojo: en IntelliJ **Shift + F6** renombra; para ejecutar es **Shift + F10** o el ▶ verde al lado de `main`.' }),
  ], { boss: true }),
]);

export default {
  ...prueba,
  key: 'prueba1',
  label: '⭐ Prueba 1',
  coach: {
    focus: 'Esta es **tu Prueba 1** convertida en método. No es memorizar: es llenar la tabla del enunciado y rellenar los 5 moldes en orden. Aquí lo practicas con un caso nuevo (PetCare).',
    exam: ['Primero la tabla de corchetes con lápiz (10 min).', 'Moldes en orden ① → ⑤; si te trabas, avanza al siguiente.', 'Antes de entregar: checklist + comparar los costos con tu cálculo a mano.'],
  },
  mision: {
    title: 'Prueba 1 contra el reloj: PetCare en IntelliJ',
    intro: 'Haz la prueba completa como si fuera el día de la evaluación. Pon un cronómetro de **90 minutos**.',
    steps: [
      'Abre **IntelliJ IDEA** → **New Project** → **Java** → nombre `PetCare` → Create.',
      'Paso 1: con lápiz y papel llena la tabla de corchetes con el enunciado de la unidad (está en la 📖 Guía).',
      'Paso 2: escribe los moldes en orden: ① `Vacunable` → ② `Paciente` (con validaciones y toString) → ③ `Perro` y `Gato` → ④ `Clinica`.',
      '⑤ Usa el `Main` de abajo (o escríbelo tú desde la tabla de datos) y ejecútalo con el **▶ verde** junto a `main` (o **Shift + F10**). Usa **Alt + Insert** para generar getters/setters y **Ctrl + I** para implementar la interfaz.',
      'Revisa el checklist de "Errores que bajan puntos" y compara los costos con tu cálculo a mano.',
      'Practica la entrega: **File → Export → Project to Zip File**. Pega la consola aquí.',
    ],
    files: [{ name: 'Main.java', code: PETCARE_MAIN }],
    expect: [
      'Registrado correctamente: Rocky', 'Registrado correctamente: Toby', 'Registrado correctamente: Luna',
      'Paciente: 3 - Luna', 'No se encontró: 9',
      'Paciente: 1 - Rocky', 'Paciente: 2 - Toby', 'Paciente: 3 - Luna',
      'Rocky: $19500.0', 'Toby: $15000.0', 'Luna: $14400.0',
    ],
  },
};
