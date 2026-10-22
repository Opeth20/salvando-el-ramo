import { c, teoria, fill, line, write, fix, out, level, unit } from './helpers.js';

// Unidades 1–4: Primeros pasos, clases y objetos, métodos, encapsulamiento.
export default [
  /* ======================= UNIDAD 1 ======================= */
  unit('Primeros pasos con Java', 'main, tipos de datos, Scanner y control de flujo', 'green', [
    level('¡Hola Mundo!', '👋', [
      teoria('El método main',
        'Todo programa Java empieza en el método **main**. La JVM lo busca por su nombre exacto.',
        c(`public class MiPrimerJava {
    public static void main(String[] args) {
        System.out.println("Hola Mundo!");
    }
}`),
        `<ul>
<li>\`public\`: la JVM puede llamarlo desde afuera.</li>
<li>\`static\`: pertenece a la clase, no necesita crear un objeto.</li>
<li>\`void\`: no devuelve nada.</li>
<li>\`String[] args\`: argumentos de la línea de comandos.</li>
</ul>
<div class="tip">📛 Convención: clases en **PascalCase** (\`MiPrimerJava\`) y variables en **camelCase** (\`nombrePersona\`).</div>`),
      fill('Completa la firma del método principal y la instrucción que imprime con salto de línea.',
        `public class MiPrimerJava {
    public [[static]] void [[main]](String[] args) {
        System.out.[[println]]("Hola Mundo!");
    }
}`, { explain: '`public static void main(String[] args)` se escribe siempre igual. ¡Apréndetela de memoria!' }),
      line('Escribe la instrucción que imprime exactamente `Hola Duoc` en la consola.', {
        checks: [['System.out.println("Hola Duoc");', 'Usa System.out.println con el texto "Hola Duoc" y termina con ;']],
        solution: 'System.out.println("Hola Duoc");',
      }),
      out('`print` no agrega salto de línea; `println` sí. ¿Qué se ve en la consola?',
        `System.out.println("Java");
System.out.print("es ");
System.out.println("genial");`,
        'Java\nes genial', { explain: '`print("es ")` deja el cursor en la misma línea, así que "genial" queda pegado después.' }),
      fix('Este programa no compila. Encuentra el error y corrígelo.', {
        starter: `public class Saludo {
    public static void main(String[] args) {
        System.out.println("Hola")
    }
}`,
        checks: [['System.out.println("Hola");', 'Cada instrucción termina en punto y coma ;']],
        solution: `public class Saludo {
    public static void main(String[] args) {
        System.out.println("Hola");
    }
}`,
        explain: 'El error clásico: falta el `;` al final de la instrucción.',
      }),
      write('Escribe una clase completa llamada `Bienvenida` con su método `main` que imprima `Bienvenido a POO`.', {
        starter: '',
        checks: [
          ['public class Bienvenida{', 'Declara public class Bienvenida'],
          [['public static void main(String[] args){', 'public static void main(String args[]){'], 'Escribe el método main completo'],
          ['System.out.println("Bienvenido a POO");', 'Imprime "Bienvenido a POO" con println'],
        ],
        solution: `public class Bienvenida {
    public static void main(String[] args) {
        System.out.println("Bienvenido a POO");
    }
}`,
      }),
    ]),

    level('Tipos de datos', '🔢', [
      teoria('Tipos de datos y operadores',
        `<table><tr><th>Tipo</th><th>Para qué</th><th>Ejemplo</th></tr>
<tr><td>\`int\`</td><td>Enteros</td><td>\`int edad = 20;\`</td></tr>
<tr><td>\`long\`</td><td>Enteros grandes</td><td>\`long n = 100000L;\`</td></tr>
<tr><td>\`double\`</td><td>Decimales</td><td>\`double precio = 19.99;\`</td></tr>
<tr><td>\`float\`</td><td>Decimal simple</td><td>\`float f = 5.75f;\`</td></tr>
<tr><td>\`char\`</td><td>Un carácter (comillas simples)</td><td>\`char letra = 'A';\`</td></tr>
<tr><td>\`boolean\`</td><td>true / false</td><td>\`boolean trabaja = true;\`</td></tr>
<tr><td>\`String\`</td><td>Texto (comillas dobles)</td><td>\`String nombre = "Ana";\`</td></tr></table>`,
        `<div class="warn">⚠️ \`int / int\` da un entero: \`7 / 2\` es \`3\`. El operador \`%\` entrega el resto: \`7 % 2\` es \`1\`.</div>
<div class="tip">➕ Con texto, \`+\` concatena de izquierda a derecha: \`1 + 2 + "3"\` → \`"33"\`.</div>`),
      fill('Elige el tipo correcto para cada variable (escríbelo tú).',
        `[[int]] edad = 20;
[[double]] estatura = 1.75;
[[boolean]] trabaja = true;
[[char]] estadoCivil = 'S';
[[String]] nombre = "Ana";`),
      line('Declara una variable `double` llamada `precio` con valor `1100.5`.', {
        checks: [['double precio=1100.5;', 'double precio = 1100.5;']],
        solution: 'double precio = 1100.5;',
      }),
      out('Ojo con la división entera. ¿Qué imprime?',
        `int a = 7;
int b = 2;
System.out.println(a / b);
System.out.println(a % b);
System.out.println(a + b + "!");`,
        '3\n1\n9!', { explain: '7/2 = 3 (se pierden los decimales), 7%2 = 1 (el resto) y 7+2 se suma antes de pegarle "!".' }),
      out('Concatenación: Java evalúa de izquierda a derecha.',
        `System.out.println("1" + 2 + 3);
System.out.println(1 + 2 + "3");`,
        '123\n33', { explain: 'Apenas aparece un String, todo lo que sigue se concatena. En el segundo caso 1+2=3 primero.' }),
      fix('Un `int` no puede guardar decimales. Corrige la declaración sin cambiar el valor.', {
        starter: `int numero = 10.5;
System.out.println(numero);`,
        checks: [[['double numero=10.5;', 'float numero=10.5f;'], 'Usa un tipo decimal para 10.5']],
        solution: `double numero = 10.5;
System.out.println(numero);`,
      }),
    ]),

    level('Scanner', '⌨️', [
      teoria('Leer datos con Scanner',
        'Para leer desde el teclado se usa la clase **Scanner** del paquete `java.util`.',
        c(`import java.util.Scanner;

public class Registro {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Ingresa tu nombre:");
        String nombre = sc.nextLine();
        int edad = sc.nextInt();
        double estatura = sc.nextDouble();
        boolean trabaja = sc.nextBoolean();
        char estadoCivil = sc.next().charAt(0);
    }
}`),
        '<div class="tip">💡 No existe `nextChar()`: se lee un texto con `next()` y se toma su primer carácter con `charAt(0)`.</div>'),
      fill('Completa el programa que registra a un usuario.',
        `import java.util.[[Scanner]];

Scanner sc = new Scanner([[System.in]]);
String nombre = sc.[[nextLine]]();
int edad = sc.[[nextInt]]();
double estatura = sc.[[nextDouble]]();`),
      line('Usando el Scanner `sc`, lee un `boolean` y guárdalo en la variable `trabaja`.', {
        checks: [['boolean trabaja=sc.nextBoolean();', 'boolean trabaja = sc.nextBoolean();']],
        solution: 'boolean trabaja = sc.nextBoolean();',
      }),
      line('Lee el estado civil como `char` en la variable `estadoCivil` (pista: `next()` + `charAt`).', {
        checks: [['char estadoCivil=sc.next().charAt(0);', 'char estadoCivil = sc.next().charAt(0);']],
        solution: 'char estadoCivil = sc.next().charAt(0);',
      }),
      write('Escribe el `main` de un programa que: importe Scanner, pida el nombre con `nextLine()` y luego imprima `Hola, ` seguido del nombre.', {
        starter: `import java.util.Scanner;

public class Saludo {
    public static void main(String[] args) {

    }
}`,
        checks: [
          ['import java.util.Scanner;', 'Importa java.util.Scanner'],
          [/Scanner \w+=new Scanner\(System\.in\);/, 'Crea el Scanner con new Scanner(System.in)'],
          [/String \w+=\w+\.nextLine\(\);/, 'Guarda el nombre en un String usando nextLine()'],
          [/System\.out\.println\("Hola, ?"\+\w+\);/, 'Imprime "Hola, " + nombre'],
        ],
        solution: `import java.util.Scanner;

public class Saludo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String nombre = sc.nextLine();
        System.out.println("Hola, " + nombre);
    }
}`,
      }),
    ]),

    level('Control de flujo', '🔀', [
      teoria('if, switch y bucles',
        c(`if (edad >= 18) {
    System.out.println("Mayor de edad");
} else if (edad >= 13) {
    System.out.println("Adolescente");
} else {
    System.out.println("Niño");
}

switch (dia) {
    case 1:
        System.out.println("Lunes");
        break;   // ¡sin break sigue al siguiente case!
    default:
        System.out.println("Otro día");
}

for (int i = 0; i < 5; i++) { ... }
while (condicion) { ... }
do { ... } while (condicion);`),
        `<table><tr><th>Operador</th><th>Significa</th></tr>
<tr><td>\`&&\`</td><td>Y (ambas verdaderas)</td></tr>
<tr><td>\`||\`</td><td>O (al menos una)</td></tr>
<tr><td>\`!\`</td><td>NO (invierte)</td></tr>
<tr><td>\`==\` / \`!=\`</td><td>Igual / distinto (números)</td></tr></table>`),
      fill('Completa el if-else que decide si alguien es mayor de edad.',
        `int edad = 18;
[[if]] (edad [[>=]] 18) {
    System.out.println("Eres mayor de edad.");
} [[else]] {
    System.out.println("Eres menor de edad.");
}`),
      out('¿Qué imprime este for?',
        `for (int i = 0; i < 7; i += 2) {
    System.out.println(i);
}`,
        '0\n2\n4\n6', { explain: 'i parte en 0 y sube de 2 en 2 mientras sea menor que 7.' }),
      out('¡Cuidado! A este switch le falta un `break`. ¿Qué imprime?',
        `int dia = 2;
switch (dia) {
    case 1:
        System.out.println("Lunes");
        break;
    case 2:
        System.out.println("Martes");
    case 3:
        System.out.println("Miércoles");
        break;
    default:
        System.out.println("Otro");
}`,
        'Martes\nMiércoles', { explain: 'Sin `break`, el case 2 "se cae" al case 3 hasta encontrar un break.' }),
      write('Dado un `int numero` ya declarado, imprime `Par` si es par o `Impar` si no lo es.', {
        starter: `int numero = 7;
`,
        checks: [
          [/numero%2==0|numero%2!=0|numero%2==1/, 'Usa el operador % para ver el resto de dividir por 2'],
          ['else', 'Usa un if-else'],
          ['System.out.println("Par");', 'Imprime "Par"'],
          ['System.out.println("Impar");', 'Imprime "Impar"'],
        ],
        solution: `int numero = 7;
if (numero % 2 == 0) {
    System.out.println("Par");
} else {
    System.out.println("Impar");
}`,
      }),
      write('Imprime la tabla de multiplicar del 5 (del 1 al 10) con un `for`. Formato: `5 x 1 = 5`.', {
        starter: '',
        checks: [
          [/for\(int (\w+)=1;\1(<=10|<11);\1(\+\+|\+=1)\)/, 'Un for que vaya de 1 a 10'],
          [/System\.out\.println\("5 x "\+\w+\+" = "\+(5\*\w+|\w+\*5|\(5\*\w+\)|\(\w+\*5\))\);/, 'Imprime "5 x " + i + " = " + (5 * i)'],
        ],
        solution: `for (int i = 1; i <= 10; i++) {
    System.out.println("5 x " + i + " = " + (5 * i));
}`,
        hint: 'Dentro del println puedes calcular: `"5 x " + i + " = " + (5 * i)`',
      }),
    ]),
  ]),

  /* ======================= UNIDAD 2 ======================= */
  unit('Clases y objetos', 'El paradigma POO: moldes, objetos, constructores y this', 'purple', [
    level('Clase vs objeto', '🧱', [
      teoria('La clase es el molde',
        'Una **clase** es un molde (blueprint). Un **objeto** es una instancia concreta creada con `new`.',
        c(`public class Perro {
    // Atributos: lo que el perro ES / TIENE
    String nombre;
    double peso;

    // Métodos: lo que el perro HACE
    public void ladrar() {
        System.out.println("Guau");
    }
}

// En el main:
Perro firulais = new Perro();   // NombreClase objeto = new NombreClase();
firulais.nombre = "Firulais";
firulais.ladrar();`),
        '<div class="tip">🍪 Clase = molde de galletas. Objeto = cada galleta. Puedes hacer muchas galletas con el mismo molde.</div>'),
      fill('Completa la clase y su uso.',
        `public [[class]] Perro {
    String nombre;
    public void ladrar() {
        System.out.println("Guau");
    }
}

Perro firulais = [[new]] Perro();
firulais.[[nombre]] = "Firulais";
firulais.[[ladrar]]();`),
      line('Crea un objeto de la clase `Gato` llamado `michi` usando el constructor sin parámetros.', {
        checks: [['Gato michi=new Gato();', 'Gato michi = new Gato();']],
        solution: 'Gato michi = new Gato();',
      }),
      line('Llama al método `maullar()` del objeto `michi`.', {
        checks: [['michi.maullar();', 'michi.maullar();']],
        solution: 'michi.maullar();',
      }),
      write('¿Qué pasa si en vez de un perro tengo un gato? Escribe la clase `Gato` con los atributos `String nombre` e `int edad`, y un método `maullar()` que imprima `Miau`.', {
        starter: '',
        checks: [
          ['public class Gato{', 'Declara public class Gato'],
          [/(private |public )?String nombre;/, 'Atributo String nombre'],
          [/(private |public )?int edad;/, 'Atributo int edad'],
          ['public void maullar(){', 'Método public void maullar()'],
          ['System.out.println("Miau");', 'Imprime "Miau"'],
        ],
        solution: `public class Gato {
    String nombre;
    int edad;

    public void maullar() {
        System.out.println("Miau");
    }
}`,
      }),
      out('Cada objeto tiene sus propios atributos. ¿Qué imprime?',
        `Perro a = new Perro();
a.nombre = "Toby";
Perro b = new Perro();
b.nombre = "Max";
System.out.println(a.nombre + " y " + b.nombre);`,
        'Toby y Max'),
    ]),

    level('Constructores y this', '🏗️', [
      teoria('El constructor',
        'El **constructor** se ejecuta al hacer `new`. Se llama igual que la clase y **no tiene tipo de retorno** (ni siquiera void).',
        c(`public class Mascota {
    private String nombre;
    private double peso;

    public Mascota(String nombre, double peso) {
        this.nombre = nombre;   // this.nombre = atributo, nombre = parámetro
        this.peso = peso;
    }

    public Mascota(String nombre) {   // otro constructor (sobrecarga)
        this.nombre = nombre;
    }
}

Mascota m = new Mascota("Doge", 12.5);`),
        '<div class="warn">⚠️ Si escribes `nombre = nombre;` sin `this`, te asignas el parámetro a sí mismo y el atributo queda en null.</div>'),
      fill('Completa el constructor.',
        `public Mascota([[String]] nombre, double peso) {
    [[this]].nombre = nombre;
    this.[[peso]] = peso;
}`),
      line('Crea una `Mascota` llamada `doge` con nombre `"Doge"` y peso `12.5`.', {
        checks: [['Mascota doge=new Mascota("Doge",12.5);', 'Mascota doge = new Mascota("Doge", 12.5);']],
        solution: 'Mascota doge = new Mascota("Doge", 12.5);',
      }),
      write('Crea otro constructor para `Mascota`, esta vez **sin peso**: solo recibe el nombre.', {
        starter: `public class Mascota {
    private String nombre;
    private double peso;

    // tu constructor aquí
}`,
        checks: [
          ['public Mascota(String nombre){', 'Constructor public Mascota(String nombre)'],
          ['this.nombre=nombre;', 'Asigna this.nombre = nombre'],
        ],
        solution: `public class Mascota {
    private String nombre;
    private double peso;

    public Mascota(String nombre) {
        this.nombre = nombre;
    }
}`,
      }),
      write('Crea un constructor **sin parámetros** en el que la mascota siempre se llame `"Doge"`.', {
        starter: `public class Mascota {
    private String nombre;

}`,
        checks: [
          ['public Mascota(){', 'Constructor sin parámetros: public Mascota()'],
          [['this.nombre="Doge";', 'nombre="Doge";'], 'Asigna "Doge" al nombre'],
        ],
        solution: `public class Mascota {
    private String nombre;

    public Mascota() {
        this.nombre = "Doge";
    }
}`,
      }),
      fix('Esto NO es un constructor, aunque lo parezca. Corrígelo.', {
        starter: `public class Mascota {
    private String nombre;

    public void Mascota(String nombre) {
        this.nombre = nombre;
    }
}`,
        checks: [
          { not: 'void Mascota', label: 'Un constructor no lleva tipo de retorno (quita el void)' },
          ['public Mascota(String nombre){', 'public Mascota(String nombre)'],
        ],
        solution: `public class Mascota {
    private String nombre;

    public Mascota(String nombre) {
        this.nombre = nombre;
    }
}`,
        explain: 'Con `void` Java lo toma como un método normal que se llama igual que la clase.',
      }),
      fix('El atributo nunca se guarda. ¿Por qué? Corrígelo.', {
        starter: `public class Persona {
    private String nombre;

    public Persona(String nombre) {
        nombre = nombre;
    }
}`,
        checks: [['this.nombre=nombre;', 'Usa this para referirte al atributo']],
        solution: `public class Persona {
    private String nombre;

    public Persona(String nombre) {
        this.nombre = nombre;
    }
}`,
      }),
      out('Las variables de objeto guardan **referencias**. ¿Qué imprime?',
        `Perro a = new Perro();
a.nombre = "Toby";
Perro c = a;
c.nombre = "Rex";
System.out.println(a.nombre);`,
        'Rex', { explain: '`c = a` no copia el perro: ambas variables apuntan al MISMO objeto.' }),
    ]),

    level('De Python a Java', '🐍', [
      teoria('Traduciendo la clase Auto (Guía 1.2.5)',
        'En la guía tienes una clase `Auto` en Python. Así se ve la traducción a Java:',
        c(`# Python
class Auto:
    def __init__(self, modelo, marca, km):
        self._modelo = modelo
        self.marca = marca
        self.km = km

    def avanzar(self, distancia):
        self.km = self.km + distancia`, 'text'),
        c(`// Java
public class Auto {
    private String modelo;
    private String marca;
    private int km;

    public Auto(String modelo, String marca, int km) {
        this.modelo = modelo;
        this.marca = marca;
        this.km = km;
    }

    public void avanzar(int distancia) {
        this.km = this.km + distancia;
    }
}`),
        `<ul><li>\`__init__\` → constructor</li><li>\`self\` → \`this\`</li><li>En Java **declaras el tipo** de cada atributo y parámetro.</li><li>\`_modelo\` (privado por convención) → \`private\` de verdad.</li></ul>`),
      fill('Traduce el `__init__` de Python a un constructor Java.',
        `public [[Auto]](String modelo, String marca, String color, int anio, int km, String tipo) {
    [[this]].modelo = modelo;
    this.marca = [[marca]];
    this.color = color;
    this.anio = anio;
    this.km = km;
    this.tipo = tipo;
}`),
      write('Declara los atributos **privados** de `Auto`: `modelo`, `marca`, `color` y `tipo` (String) más `anio` y `km` (int).', {
        starter: `public class Auto {

}`,
        checks: [
          ['private String modelo;', 'private String modelo;'],
          ['private String marca;', 'private String marca;'],
          ['private String color;', 'private String color;'],
          ['private int anio;', 'private int anio;'],
          ['private int km;', 'private int km;'],
          ['private String tipo;', 'private String tipo;'],
        ],
        solution: `public class Auto {
    private String modelo;
    private String marca;
    private String color;
    private int anio;
    private int km;
    private String tipo;
}`,
      }),
      write('Escribe el método `avanzar(int distancia)`: suma la distancia a `km` e imprime `Avanzando: X km. Km totales: Y`.', {
        starter: `public void avanzar(int distancia) {

}`,
        checks: [
          ['public void avanzar(int distancia){', 'Firma: public void avanzar(int distancia)'],
          [['km=km+distancia;', 'this.km=this.km+distancia;', 'km+=distancia;', 'this.km+=distancia;', 'this.km=km+distancia;'], 'Suma la distancia a km'],
          [/System\.out\.println\("Avanzando: "\+distancia\+" km\. Km totales: "\+(this\.)?km\);/, 'Imprime "Avanzando: " + distancia + " km. Km totales: " + km'],
        ],
        solution: `public void avanzar(int distancia) {
    km = km + distancia;
    System.out.println("Avanzando: " + distancia + " km. Km totales: " + km);
}`,
      }),
      write('Ahora `retroceder(int distancia)`: resta la distancia a `km` e imprime `Retrocediendo: X km. Km totales: Y`.', {
        starter: '',
        checks: [
          ['public void retroceder(int distancia){', 'Firma: public void retroceder(int distancia)'],
          [['km=km-distancia;', 'this.km=this.km-distancia;', 'km-=distancia;', 'this.km-=distancia;', 'this.km=km-distancia;'], 'Resta la distancia a km'],
          [/System\.out\.println\("Retrocediendo: "\+distancia\+" km\. Km totales: "\+(this\.)?km\);/, 'Imprime el mensaje con los km totales'],
        ],
        solution: `public void retroceder(int distancia) {
    km = km - distancia;
    System.out.println("Retrocediendo: " + distancia + " km. Km totales: " + km);
}`,
      }),
      out('Usando la clase Auto que acabas de escribir (km parte en 100):',
        `Auto auto = new Auto("Yaris", "Toyota", "Rojo", 2020, 100, "Sedán");
auto.avanzar(50);
auto.retroceder(30);`,
        'Avanzando: 50 km. Km totales: 150\nRetrocediendo: 30 km. Km totales: 120'),
    ]),
  ]),

  /* ======================= UNIDAD 3 ======================= */
  unit('Métodos', 'void vs return, parámetros, static y sobrecarga', 'blue', [
    level('void vs return', '↩️', [
      teoria('Anatomía de un método',
        c(`//  modificador  retorno  nombre   (parámetros)
    public       int      sumar   (int a, int b) {
        return a + b;     // devuelve un valor del tipo declarado
    }

    public void saludar(String nombre) {   // void: no devuelve nada
        System.out.println("Hola " + nombre);
    }`),
        '<ul><li>Si el método **no es void**, todos los caminos deben terminar en `return valor;`.</li><li>Un método que *calcula* debería **retornar**, no imprimir: así lo puedes reutilizar.</li></ul>'),
      fill('Completa los tipos de retorno y el return.',
        `public [[int]] sumar(int a, int b) {
    [[return]] a + b;
}

public [[void]] saludar(String nombre) {
    System.out.println("Hola " + nombre);
}`),
      write('Escribe `public double calcularIva(double precio)` que retorne el 19% del precio.', {
        starter: '',
        checks: [
          ['public double calcularIva(double precio){', 'Firma: public double calcularIva(double precio)'],
          [['return precio*0.19;', 'return 0.19*precio;', 'return precio*19/100;', 'return(precio*0.19);'], 'Retorna precio * 0.19'],
        ],
        solution: `public double calcularIva(double precio) {
    return precio * 0.19;
}`,
      }),
      write('Escribe `public boolean esMayorDeEdad(int edad)` que retorne `true` si la edad es 18 o más.', {
        starter: '',
        checks: [
          ['public boolean esMayorDeEdad(int edad){', 'Firma: public boolean esMayorDeEdad(int edad)'],
          [/edad>=18|edad>17|18<=edad/, 'Compara la edad con 18'],
          ['return', 'Usa return'],
        ],
        solution: `public boolean esMayorDeEdad(int edad) {
    return edad >= 18;
}`,
        explain: 'Una comparación ya es un boolean, así que puedes retornarla directo: `return edad >= 18;`',
      }),
      fix('El método promete un `int` pero no lo entrega. Arréglalo.', {
        starter: `public int doble(int n) {
    int resultado = n * 2;
}`,
        checks: [[['return resultado;', 'return n*2;'], 'Retorna el resultado']],
        solution: `public int doble(int n) {
    int resultado = n * 2;
    return resultado;
}`,
      }),
      out('¿Qué imprime?',
        `public class Main {
    static int cuadrado(int x) {
        return x * x;
    }

    public static void main(String[] args) {
        System.out.println(cuadrado(3) + cuadrado(2));
    }
}`,
        '13'),
    ]),

    level('Parámetros y static', '📦', [
      teoria('Parámetros, argumentos y static',
        '**Parámetro**: la variable en la firma (`int x`). **Argumento**: el valor que envías al llamar (`cuadrado(5)`).',
        c(`public class Calculadora {
    public static double promedio(double a, double b) {  // de clase
        return (a + b) / 2;
    }
    public void encender() { ... }   // de instancia
}

double p = Calculadora.promedio(5, 6);   // static: Clase.metodo()
Calculadora calc = new Calculadora();
calc.encender();                          // instancia: objeto.metodo()`),
        '<div class="warn">⚠️ Desde `main` (que es static) no puedes llamar directo a un método de instancia: necesitas un objeto.</div><div class="tip">📬 Java pasa los primitivos **por valor**: el método recibe una copia.</div>'),
      line('Usa el método estático `max` de la clase `Math` con 8 y 3, y guarda el resultado en `int mayor`.', {
        checks: [['int mayor=Math.max(8,3);', 'int mayor = Math.max(8, 3);']],
        solution: 'int mayor = Math.max(8, 3);',
      }),
      fill('Completa el método de clase y su llamada.',
        `public class Calculadora {
    public [[static]] double promedio(double a, double b) {
        return (a + b) / 2;
    }
}

double p = [[Calculadora]].promedio(5.0, 6.0);`),
      out('Paso por valor: ¿qué imprime?',
        `public class Main {
    static void cambiar(int x) {
        x = 99;
    }

    public static void main(String[] args) {
        int n = 5;
        cambiar(n);
        System.out.println(n);
    }
}`,
        '5', { explain: '`cambiar` modifica su copia `x`, no la variable `n` del main.' }),
      write('Escribe `public static int mayorDeTres(int a, int b, int c)` que retorne el mayor de los tres (puedes usar `Math.max`).', {
        starter: '',
        checks: [
          ['public static int mayorDeTres(int a,int b,int c){', 'Firma: public static int mayorDeTres(int a, int b, int c)'],
          ['return', 'Retorna el mayor'],
          [/Math\.max\(|>/, 'Compara los valores (Math.max o if)'],
        ],
        solution: `public static int mayorDeTres(int a, int b, int c) {
    return Math.max(a, Math.max(b, c));
}`,
      }),
      fix('Error de compilación: "non-static method saludar() cannot be referenced from a static context". Arréglalo creando un objeto `Saludo` en el main.', {
        starter: `public class Saludo {
    public void saludar() {
        System.out.println("Hola!");
    }

    public static void main(String[] args) {
        saludar();
    }
}`,
        checks: [
          [/Saludo \w+=new Saludo\(\);/, 'Crea un objeto: Saludo s = new Saludo();'],
          [/\w+\.saludar\(\);/, 'Llama al método desde el objeto: s.saludar();'],
        ],
        solution: `public class Saludo {
    public void saludar() {
        System.out.println("Hola!");
    }

    public static void main(String[] args) {
        Saludo s = new Saludo();
        s.saludar();
    }
}`,
      }),
    ]),

    level('Sobrecarga', '🎭', [
      teoria('Sobrecarga de métodos',
        'Puedes tener varios métodos con **el mismo nombre** si cambian **los parámetros** (cantidad o tipo). Java elige cuál usar según los argumentos.',
        c(`public double area(double radio) {               // círculo
    return Math.PI * radio * radio;
}
public double area(double base, double altura) {  // rectángulo
    return base * altura;
}`),
        '<div class="warn">⚠️ Cambiar **solo el tipo de retorno** NO es sobrecarga: no compila.</div>'),
      fill('Completa la sobrecarga de `area`.',
        `public double [[area]](double radio) {
    return Math.PI * radio * radio;
}
public double area(double base, [[double]] altura) {
    return base * [[altura]];
}`),
      write('Sobrecarga `saludar`: una versión sin parámetros que imprima `Hola!` y otra que reciba `String nombre` e imprima `Hola, ` + nombre.', {
        starter: '',
        checks: [
          ['public void saludar(){', 'public void saludar()'],
          ['System.out.println("Hola!");', 'Imprime "Hola!"'],
          ['public void saludar(String nombre){', 'public void saludar(String nombre)'],
          [/System\.out\.println\("Hola, ?"\+nombre\);/, 'Imprime "Hola, " + nombre'],
        ],
        solution: `public void saludar() {
    System.out.println("Hola!");
}

public void saludar(String nombre) {
    System.out.println("Hola, " + nombre);
}`,
      }),
      out('Java elige la versión según el tipo del argumento. ¿Qué imprime?',
        `public class Main {
    static String tipo(int x) { return "int"; }
    static String tipo(double x) { return "double"; }
    static String tipo(String x) { return "String"; }

    public static void main(String[] args) {
        System.out.println(tipo(5));
        System.out.println(tipo(5.0));
        System.out.println(tipo("5"));
    }
}`,
        'int\ndouble\nString'),
      fix('Esto no compila: dos métodos con la misma firma. Cambia el **segundo** para que reciba `(double a)` y sea una sobrecarga válida.', {
        starter: `public int calcular(int a) {
    return a * 2;
}

public double calcular(int a) {
    return a * 2.5;
}`,
        checks: [
          ['public int calcular(int a){', 'Mantén el primer método'],
          ['public double calcular(double a){', 'El segundo debe recibir double a'],
        ],
        solution: `public int calcular(int a) {
    return a * 2;
}

public double calcular(double a) {
    return a * 2.5;
}`,
      }),
      fill('Escribe la palabra: ¿qué concepto se aplica aquí?',
        `public void encender() { ... }
public void encender(char tipoMotor) { ... }
// Mismo nombre, distintos parámetros → [[sobrecarga|Sobrecarga]]`),
    ]),
  ]),

  /* ======================= UNIDAD 4 ======================= */
  unit('Encapsulamiento y abstracción', 'private, getters, setters, validaciones y toString', 'orange', [
    level('Modificadores de acceso', '🔒', [
      teoria('Encapsulamiento',
        'Encapsular es **proteger** los datos del objeto: los atributos son `private` y se accede a ellos con métodos públicos.',
        `<table><tr><th>Modificador</th><th>¿Quién lo ve?</th></tr>
<tr><td>\`public\`</td><td>Todos</td></tr>
<tr><td>\`protected\`</td><td>Mismo paquete + subclases</td></tr>
<tr><td>(sin nada)</td><td>Solo el mismo paquete</td></tr>
<tr><td>\`private\`</td><td>Solo la misma clase</td></tr></table>`,
        '<div class="tip">🧠 **Abstracción**: modelar solo lo que importa para el problema. Un Auto de un sistema de registro necesita patente y km, no la marca de sus neumáticos.</div>'),
      fill('Protege los datos de la cuenta.',
        `public class CuentaBancaria {
    [[private]] String titular;
    [[private]] double saldo;

    [[public]] void depositar(double monto) {
        saldo = saldo + monto;
    }
}`),
      line('Declara un atributo privado `int` llamado `stock`.', {
        checks: [['private int stock;', 'private int stock;']],
        solution: 'private int stock;',
      }),
      fix('`saldo` es privado, así que este main no compila. Usa el método `depositar` para sumar 5000.', {
        starter: `CuentaBancaria cuenta = new CuentaBancaria();
cuenta.saldo = 5000;`,
        checks: [
          { not: 'cuenta.saldo', label: 'No accedas directo a cuenta.saldo' },
          ['cuenta.depositar(5000);', 'Usa cuenta.depositar(5000);'],
        ],
        solution: `CuentaBancaria cuenta = new CuentaBancaria();
cuenta.depositar(5000);`,
      }),
      write('Abstracción (Guía 1.2.5, ej. 9): crea la clase `Conductor` con 4 atributos privados: `nombre` (String), `rut` (String), `licencia` (String) y `edad` (int), y un constructor que reciba los 4.', {
        starter: '',
        checks: [
          ['public class Conductor{', 'public class Conductor'],
          ['private String nombre;', 'private String nombre;'],
          ['private String rut;', 'private String rut;'],
          ['private String licencia;', 'private String licencia;'],
          ['private int edad;', 'private int edad;'],
          [/public Conductor\(String \w+,String \w+,String \w+,int \w+\)\{/, 'Constructor con los 4 parámetros (String, String, String, int)'],
          [/(this\.)?edad=\w+;|setEdad\(/, 'Asigna los atributos dentro del constructor'],
        ],
        solution: `public class Conductor {
    private String nombre;
    private String rut;
    private String licencia;
    private int edad;

    public Conductor(String nombre, String rut, String licencia, int edad) {
        this.nombre = nombre;
        this.rut = rut;
        this.licencia = licencia;
        this.edad = edad;
    }
}`,
      }),
    ]),

    level('Getters y setters', '🔑', [
      teoria('Accesadores y mutadores',
        'Los **getters** leen un atributo y los **setters** lo modifican. Son la "puerta controlada" hacia los datos privados.',
        c(`private String nombre;

public String getNombre() {          // get + Atributo con mayúscula
    return nombre;
}

public void setNombre(String nombre) {   // set + Atributo con mayúscula
    this.nombre = nombre;
}

// Para boolean se suele usar "is":
public boolean isActivo() { return activo; }`)),
      fill('Completa el getter y el setter.',
        `public [[String]] getNombre() {
    return [[nombre]];
}

public [[void]] setNombre(String nombre) {
    this.nombre = [[nombre]];
}`),
      write('Escribe el getter y el setter para `private int edad;`', {
        starter: `private int edad;
`,
        checks: [
          ['public int getEdad(){', 'public int getEdad()'],
          [['return edad;', 'return this.edad;'], 'El getter retorna edad'],
          [/public void setEdad\(int \w+\)\{/, 'public void setEdad(int edad)'],
          [/this\.edad=\w+;/, 'El setter asigna this.edad'],
        ],
        solution: `private int edad;

public int getEdad() {
    return edad;
}

public void setEdad(int edad) {
    this.edad = edad;
}`,
      }),
      line('Escribe en una línea el getter del atributo `boolean activo` (usa la convención `is`).', {
        checks: [[['public boolean isActivo(){return activo;}', 'public boolean isActivo(){return this.activo;}', 'public boolean getActivo(){return activo;}'], 'public boolean isActivo() { return activo; }']],
        solution: 'public boolean isActivo() { return activo; }',
      }),
      out('¿Qué imprime?',
        `Persona p = new Persona("Ana", 20);
p.setNombre("Luis");
p.setEdad(p.getEdad() + 1);
System.out.println(p.getNombre() + " " + p.getEdad());`,
        'Luis 21'),
      write('En Python el modelo era `self._modelo`. Escribe en Java `getModelo()` y `setModelo(String nuevoModelo)` para `private String modelo;`', {
        starter: `private String modelo;
`,
        checks: [
          ['public String getModelo(){', 'public String getModelo()'],
          [['return modelo;', 'return this.modelo;'], 'Retorna modelo'],
          ['public void setModelo(String nuevoModelo){', 'public void setModelo(String nuevoModelo)'],
          [['this.modelo=nuevoModelo;', 'modelo=nuevoModelo;'], 'Asigna nuevoModelo al atributo'],
        ],
        solution: `private String modelo;

public String getModelo() {
    return modelo;
}

public void setModelo(String nuevoModelo) {
    this.modelo = nuevoModelo;
}`,
      }),
    ]),

    level('Validaciones', '🛡️', [
      teoria('Setters que protegen',
        'El setter es el lugar ideal para **validar**. Si el dato es malo, se lanza una excepción. Y el constructor **llama a los setters** para no saltarse la validación.',
        c(`public Persona(String nombre, int edad) {
    setNombre(nombre);   // ← nunca this.edad = edad aquí
    setEdad(edad);
}

public void setEdad(int edad) {
    if (edad < 0) {
        throw new IllegalArgumentException("La edad no puede ser negativa");
    }
    this.edad = edad;
}

@Override
public String toString() {
    return "Persona: " + nombre + ", edad: " + edad;
}`),
        c(`try {
    p.setEdad(-5);
} catch (IllegalArgumentException e) {
    System.out.println("Error: " + e.getMessage());
}`),
        '<div class="tip">📝 Strings se comparan con `.equals()` y se revisan vacíos con `.isEmpty()` o `.trim().isEmpty()`.</div>'),
      fill('Completa la validación.',
        `public void setEdad(int edad) {
    if (edad [[<]] 0) {
        [[throw]] [[new]] IllegalArgumentException("La edad no puede ser negativa");
    }
    this.edad = edad;
}`),
      write('Escribe `setPrecio(double precio)`: si el precio es menor o igual a 0 lanza `IllegalArgumentException` con el mensaje `El precio debe ser mayor a 0`; si no, lo asigna.', {
        starter: '',
        checks: [
          ['public void setPrecio(double precio){', 'public void setPrecio(double precio)'],
          [/if\(precio<=0\)|if\(precio<=0\.0\)|if\(0>=precio\)|if\(!\(precio>0\)\)/, 'if (precio <= 0)'],
          ['throw new IllegalArgumentException("El precio debe ser mayor a 0");', 'Lanza la excepción con el mensaje pedido'],
          ['this.precio=precio;', 'Asigna this.precio = precio'],
        ],
        solution: `public void setPrecio(double precio) {
    if (precio <= 0) {
        throw new IllegalArgumentException("El precio debe ser mayor a 0");
    }
    this.precio = precio;
}`,
      }),
      write('Escribe `setNombre(String nombre)` que rechace nombres vacíos lanzando `IllegalArgumentException("El nombre es obligatorio")`.', {
        starter: '',
        checks: [
          ['public void setNombre(String nombre){', 'public void setNombre(String nombre)'],
          [/isEmpty\(\)|isBlank\(\)|equals\(""\)|length\(\)==0/, 'Revisa si el nombre está vacío (isEmpty / isBlank)'],
          ['throw new IllegalArgumentException("El nombre es obligatorio");', 'Lanza la excepción con el mensaje pedido'],
          ['this.nombre=nombre;', 'Asigna this.nombre = nombre'],
        ],
        solution: `public void setNombre(String nombre) {
    if (nombre == null || nombre.trim().isEmpty()) {
        throw new IllegalArgumentException("El nombre es obligatorio");
    }
    this.nombre = nombre;
}`,
      }),
      fix('Este constructor se salta las validaciones de los setters. Haz que use `setNombre` y `setEdad`.', {
        starter: `public Persona(String nombre, int edad) {
    this.nombre = nombre;
    this.edad = edad;
}`,
        checks: [
          [['setNombre(nombre);', 'this.setNombre(nombre);'], 'Llama a setNombre(nombre)'],
          [['setEdad(edad);', 'this.setEdad(edad);'], 'Llama a setEdad(edad)'],
          { not: 'this.edad=edad;', label: 'No asignes this.edad directamente' },
        ],
        solution: `public Persona(String nombre, int edad) {
    setNombre(nombre);
    setEdad(edad);
}`,
      }),
      out('El setter `setEdad` es el de la teoría. ¿Qué imprime?',
        `Persona p = new Persona("Ana", 20);
try {
    p.setEdad(-5);
    System.out.println("OK");
} catch (IllegalArgumentException e) {
    System.out.println("Error: " + e.getMessage());
}
System.out.println("Fin");`,
        'Error: La edad no puede ser negativa\nFin', { explain: 'El throw corta el try: "OK" nunca se imprime. Después del catch el programa sigue.' }),
      write('Sobrescribe `toString()` para que retorne `Persona: <nombre>, edad: <edad>`.', {
        starter: '',
        checks: [
          ['@Override', 'Anota con @Override'],
          ['public String toString(){', 'public String toString()'],
          [/return "Persona: "\+(this\.)?nombre\+", edad: "\+(this\.)?edad;/, 'return "Persona: " + nombre + ", edad: " + edad;'],
        ],
        solution: `@Override
public String toString() {
    return "Persona: " + nombre + ", edad: " + edad;
}`,
        explain: '`System.out.println(p)` llama automáticamente a `p.toString()`.',
      }),
    ]),
  ]),
];
