/* ==============================================
   The Godfather - Archivo Corleone - Datos Cinematográficos
   Datos estructurados de la película y personajes
   ============================================== */

export const movieData = {
  // Información de la película principal
  movie: {
    originalTitle: "The Godfather",
    spanishTitle: "El Padrino",
    year: 1972,
    director: "Francis Ford Coppola",
    duration: "175 minutos",
    genre: "Crimen, Drama",
    productionCompany: "Paramount Pictures",
    cinematographer: "Gordon Willis",
    composer: "Nino Rota",
    synopsis: "Una historia épica de la familia Corleone, liderada por el patriarca Don Vito Corleone, que lucha por mantener su imperio en el mundo del crimen organizado mientras los Estados Unidos cambian radicalmente.",
    productionContext: "Rodada entre 1971 y 1972 en Nueva York y Sicilia, la película retrata la posguerra estadounidense y el peso de la familia, la lealtad y el poder dentro del crimen organizado."
  },

  // Personajes principales con información completa
  basePath: '/assets',
  characters: [
    {
      id: 1,
      name: "Don Vito Corleone",
      actor: "Marlon Brando",
      age: "60",
      role: "Patriarca de la familia",
      image: 'vito-corleone.jpg',
      description: "El poderoso patriarca de la familia Corleone, un líder carismático con gran experiencia en el mundo del crimen organizado.",
      bio: "Nacido en Sicilia en 1902, Vito Corleone llegó a Estados Unidos como un joven inmigrante. A través de años de trabajo duro y estrategia astuta, se convirtió en el capo de la familia Corleone, un hombre temido y respetado en el submundo del crimen. Su lema es simple: 'Nunca mires atrás, excepto para fotografiar'.",
      quotes: [
        "La único en esta vida que realmente importa es tu familia.",
        "Quiero que me hagas un favor: no me mires como si yo fuera un hipócrita de moralidad vacía.",
        "Si alguna vez necesitas ayuda, siempre estoy aquí. Pero ayuda a alguien que valga la pena."
      ],
      appearance: "Hombre de mediana edad, aproximadamente 5'9', contextura robusta, cabello oscuro corto, ojos oscuros, mirada penetrante.",
      significance: "El pilar fundamental de la familia Corleone, su sabiduría y liderazgo definen la película."
    },
    {
      id: 2,
      name: "Michael Corleone",
      actor: "Al Pacino",
      age: "30",
      role: "Hijo menor, nuevo capo",
      image: 'michael-corleone.jpg',
      description: "El hijo menor de Don Vito, inicialmente reacio a los negocios familiares, pero quien eventualmente se convierte en el nuevo y despiadado líder de la familia.",
      bio: "Michael creció siendo el más joven de los hijos Corleone. Tras asesinar el asesinato de sus hermanos mayores y presenciar la traición de su padre, Michael se endureció, convirtiéndose en un estratega frío y calculador. Su desarrollo durante la película representa la transformación de 'recién llegado' a 'héroe caído'.",
      quotes: [
        "¿Qué vamos a hacer contigo? Te protegeré. Te haré que seas parte de la familia.",
        "Hay una forma sencilla de que hagamos que tu nieta descanse en paz. ¿Sabes qué es? Matas a su novio.",
        "Porque solo soy un hombre, pero tengo principios. Y sé que nunca pagaría por un trabajo sucio cuando puedo hacerlo de manera elegante."
      ],
      appearance: "Hombre joven, aproximadamente 6'0', complexión física media, cabello oscuro, ojos azules, rostro anguloso.",
      significance: "El arquetipo del héroe trágico, el personaje central de la transformación y el legado."
    },
    {
      id: 3,
      name: "Sonny Corleone",
      actor: "James Caan",
      age: "35",
      role: "Hijo mayor, caporegime",
      image: 'sonny-corleone.jpg',
      description: "El hijo mayor de Don Vito, impetuoso, temperamental, conocido por su naturaleza explosiva y liderazgo agresivo.",
      bio: "Sonny es el típico capitán de bomberos: violento, incontrolable y con poco respeto por la estrategia de su padre. Su temperamento impetuoso y su lealtad inquebrantable lo convierten en el protector de su familia, pero también en su mayor debilidad.",
      quotes: [
        "Tengo un rival. ¿Sabes quién es? Mi padre. ¿Sabes por qué? Porque él es un maldito padre de mierda.",
        "Mira, papá, esta puerta está cerrada, pero no hay cartel de 'no pasar'. Solo necesitas las llaves."
      ],
      appearance: "Hombre robusto, aproximadamente 6'2', contextura grande, pelo oscuro, ojos grises, mandíbula fuerte.",
      significance: "El temperamento impetuoso de Sonny contrasta con la sabiduría de su padre."
    },
    {
      id: 4,
      name: "Tom Hagen",
      actor: "Robert Duvall",
      age: "40",
      role: "Hijo adoptivo, asesor principal",
      image: 'tom-hagen.jpg',
      description: "El hijo adoptivo de Don Vito, un hábil abogado y confidente, conocido como el 'hombre de confianza' de la familia.",
      bio: "Hagen es el origen del servicio profesional de la familia. Educado en derecho y leyes, su posición única le permite proteger los intereses de su familia desde el mundo legal externo, actuando como un puente entre el submundo del crimen y la sociedad respetable.",
      quotes: [
        "Siempre pensé que era de familia.",
        "En realidad soy un corleone."
      ],
      appearance: "Hombre alto, aproximadamente 6'1', complexión delgada, cabello oscuro, corbata fina elegante.",
      significance: "El asesino más eficiente del sistema legal, quien demuestra que la lealtad no tiene precio."
    },
    {
      id: 5,
      name: "Kay Adams",
      actor: "Diane Keaton",
      age: "25",
      role: "Novia de Michael, luego esposa",
      image: 'kay-adams.jpg',
      description: "Una idealista optimista y carismática que se convierte en la novia de Michael Corleone, quien eventualmente se hace parte de la familia.",
      bio: "Kay representa el nuevo mundo: optimista, idealista y amorosa. Su relación con Michael muestra cómo el amor y la lealtad pueden cambiar incluso a la persona más dura. Al principio fascinada por los negocios de Michael, luego descubre la realidad de su familia.",
      quotes: [
        "Creo en la palabra de Michael Corleone. ¿Has oído lo que ha dicho sobre mi padre? Estás hablando de la persona equivocada.",
        "Una vez me ofrecieron una oportunidad para cambiar mi vida, renuncié a ello porque estaba enamorada."
      ],
      appearance: "Mujer joven, aproximadamente 5'5', estilo elegante, cabello castaño claro, aspecto inocente.",
      significance: "La voz de la razón y la familia en un mundo de hombres de negocios sin escrúpulos."
    },
    {
      id: 6,
      name: "Fredo Corleone",
      actor: "John Cazale",
      age: "28",
      role: "Hijo despreciado, despreciado",
      image: 'fredo-corleone.jpg',
      description: "El hijo despreciado de Don Vito, quien lucha constantemente contra el desprecio de su padre y su posición inferior en la familia.",
      bio: "Fredo es el hermano más odiado de todos los Corleones. Sus intentos de servir a la familia y su difícil relación con Don Vito representan la tragedia del heredero despreciado, quien lucha por encontrar su lugar en un mundo de hombres que no lo aprecian.",
      quotes: [
        "Te estoy diciendo, hermano, que eres un idiota. Todo lo que hiciste hasta ahora no significa nada.",
        "No soy un Corleone. No lo soy."
      ],
      appearance: "Hombre bajo, aproximadamente 5'8', complexión delgada, pelo oscuro, mirada perdida.",
      significance: "La trágica historia del hermano menos amado, quien muestra la crueldad del poder."
    },
    {
      id: 7,
      name: "Connie Corleone",
      actor: "Talia Shire",
      age: "32",
      role: "Hija rebelde, camarera de salón",
      image: 'connie-corleone.jpg',
      description: "La hija rebelde de Don Vito, quien mantiene una relación difícil con su padre pero demuestra su lealtad a la familia.",
      bio: "Connie es la rebelde de la familia. Aunque demuestra amor por su familia, su actitud desafiante la hace la más impopular entre sus hermanos. Su matrimonio con Carlo Rizzi (quien más tarde reniega de su identidad) muestra los conflictos generacionales dentro de los Corleone.",
      quotes: [
        "¡No me importa lo que tú digas, papi!",
        "Mi padre es un magnate del crimen. Todo lo que puedo decir es...¡Escucha la verdad, simplemente escucha la verdad!"
      ],
      appearance: "Mujer joven, aproximadamente 5'6', aspecto rebelde, cabello moreno, estilo juvenil.",
      significance: "La hija rebelde que desafía las expectativas y demuestra amor familiar de manera única."
    }
  ],

  // Información cinematográfica sobre la película
  filmography: {
    releaseTimeline: [
      { year: 1970, event: "Comienza la producción de The Godfather", description: "Coppola recluta al equipo de producción" },
      { year: 1971, event: "Inicio del rodaje", description: "Rodaje en locaciones de Nueva York y Sicilia" },
      { year: 1972, event: "Estreno en los cines", description: "Lanzamiento en marzo de 1972" },
      { year: 1973, event: "Recibió 10 nominaciones al Oscar", description: "Ganó tres: Mejor Película, Mejor Actor y Mejor Guion Adaptado" }
    ],

    themes: [
      {
        title: "Poder y Familia",
        description: "La búsqueda desesperada por mantener el poder dentro de la familia Corleone"
      },
      {
        title: "Lealtad y Traición",
        description: "El código de honor que rige las relaciones dentro de la familia"
      },
      {
        title: "Tradición vs. Cambio",
        description: "El choque entre los valores tradicionales y el mundo moderno"
      },
      {
        title: "Ética del Crimen",
        description: "Una moralidad alternativa al sistema legal estadounidense"
      }
    ],

    legacy: [
      "Considerada una de las mejores películas de la historia del cine",
      "Ganó tres premios Oscar: Mejor Película, Mejor Actor y Mejor Guion Adaptado",
      "Seleccionada para el Registro Nacional de Películas de Estados Unidos",
      "El American Film Institute la ubicó entre las tres mejores del cine estadounidense",
      "Recaudó más de 250 millones de dólares en todo el mundo",
      "Su secuela, The Godfather: Part II, se estrenó en 1974"
    ]
  },

  // Galería atmosférica del universo de la película
  gallery: [
    {
      src: '/assets/images/gallery/01-manhattan-nocturno.webp',
      alt: 'Perspectiva nocturna de Little Italy con farolas tenues y rascacielos clásicos.',
      title: 'Little Italy y bajo Manhattan',
      subtitle: 'Avenidas en penumbra y reflejos de posguerra (c. 1946)',
      credit: 'Florian Wehde · Unsplash'
    },
    {
      src: '/assets/images/gallery/02-campina-siciliana.webp',
      alt: 'Campiña rústica siciliana con colinas áridas, senderos de tierra y olivares.',
      title: 'Campiña y refugio en Sicilia',
      subtitle: 'Colinas áridas, olivares y muros de piedra ancestrales',
      credit: 'Jack Ward · Unsplash'
    },
    {
      src: '/assets/images/gallery/03-despacho-claroscuro.webp',
      alt: 'Escritorio clásico de madera noble iluminado con lámpara cálida en claroscuro.',
      title: 'El despacho familiar',
      subtitle: 'Penumbra, madera noble y acuerdos a puerta cerrada',
      credit: 'Federica Galli · Unsplash'
    },
    {
      src: '/assets/images/gallery/04-coche-clasico-lluvia.webp',
      alt: 'Automóvil sedán clásico de los años 40 sobre asfalto mojado bajo la lluvia.',
      title: 'Sedán clásico de época',
      subtitle: 'Carrocería oscura bajo la lluvia neoyorquina',
      credit: 'Stefan Rodriguez · Unsplash'
    },
    {
      src: '/assets/images/gallery/05-telefono-vintage.webp',
      alt: 'Teléfono antiguo de disco sobre mesa de despacho en penumbra.',
      title: 'Llamada confidencial',
      subtitle: 'Teléfono negro de disco sobre mesa de despacho',
      credit: 'Pavan Trikutam · Unsplash'
    },
    {
      src: '/assets/images/gallery/06-trattoria-bodega.webp',
      alt: 'Mesa de taberna tradicional con copas de vino tinto y barricas de roble.',
      title: 'Bodega y cena privada',
      subtitle: 'Botellas de reserva, copas y mesa reservada',
      credit: 'Hermes Rivera · Unsplash'
    },
    {
      src: '/assets/images/gallery/07-maquina-escribir.webp',
      alt: 'Teclado metálico de máquina de escribir antigua sobre pliegos mecanografiados.',
      title: 'Expedientes del consiglieri',
      subtitle: 'Máquina de escribir mecánica y documentos legales',
      credit: 'Patrick Fore · Unsplash'
    },
    {
      src: '/assets/images/gallery/08-catedral-cirios.webp',
      alt: 'Candelabros con cirios encendidos ante las arcadas de piedra de una basílica.',
      title: 'Bautismo y juramento solemne',
      subtitle: 'Cirios encendidos ante las arcadas de la basílica',
      credit: 'Grant Whitty · Unsplash'
    },
    {
      src: '/assets/images/gallery/09-muelles-niebla.webp',
      alt: 'Muelles portuarios industriales cubiertos por niebla matinal junto al río.',
      title: 'Muelles del puerto industrial',
      subtitle: 'Cargueros, niebla y almacenes del East River',
      credit: 'Maxime Gilbert · Unsplash'
    },
    {
      src: '/assets/images/gallery/10-copas-brindis.webp',
      alt: 'Vaso bajo de cristal tallado con licor ámbar reflejando luz dorada sobre caoba.',
      title: 'El brindis de respeto',
      subtitle: 'Cristalería clásica sobre madera oscura pulida',
      credit: 'Kobby Mendez · Unsplash'
    }
  ],

  // Datos para el quiz
  quiz: {
    questions: [
      {
        id: 1,
        question: "¿Quién dirigió originalmente 'The Godfather'?",
        options: ["Martin Scorsese", "Stanley Kubrick", "Francis Ford Coppola", "Steven Spielberg"],
        correct: "Francis Ford Coppola",
        difficulty: "fácil",
        category: "dirección"
      },
      {
        id: 2,
        question: "¿Qué actor interpretó a Don Vito Corleone?",
        options: ["Robert De Niro", "James Caan", "Marlon Brando", "Al Pacino"],
        correct: "Marlon Brando",
        difficulty: "fácil",
        category: "actuación"
      },
      {
        id: 3,
        question: "¿En qué año se estrenó The Godfather?",
        options: ["1970", "1971", "1972", "1973"],
        correct: "1972",
        difficulty: "fácil",
        category: "historia"
      },
      {
        id: 4,
        question: "¿Qué comida italiana le pide Michael a Sonny después de que Sonny le ofrece la oportunidad de cambiar su vida?",
        options: ["Lasagna", "Pizza", "Spaghetti", "Rigatoni"],
        correct: "Rigatoni",
        difficulty: "medio",
        category: "diálogo"
      },
      {
        id: 5,
        question: "¿Qué frase famosa dice Don Vito Corleone sobre las mujeres y los niños?",
        options: [
          "Mientras hay lágrimas, hay esperanza",
          "En la mafia, las mujeres siempre siguen a sus hombres",
          "Los negocios son negocios; las mujeres y los niños son inocentes",
          "Las mujeres y los niños deben quedarse fuera de los negocios"
        ],
        correct: "Las mujeres y los niños deben quedarse fuera de los negocios",
        difficulty: "difícil",
        category: "diálogo"
      },
      {
        id: 6,
        question: "¿Qué profesión tenía Tom Hagen antes de trabajar para los Corleone?",
        options: ["Abogado", "Periodista", "Doctor", "Ingeniero"],
        correct: "Abogado",
        difficulty: "medio",
        category: "personajes"
      },
      {
        id: 7,
        question: "¿Cuál es el nombre del actor que interpretó a Sonny Corleone?",
        options: ["Al Pacino", "James Caan", "Robert Duvall", "Diane Keaton"],
        correct: "James Caan",
        difficulty: "fácil",
        category: "actuación"
      },
      {
        id: 8,
        question: "¿Cuál fue el primer nombre del padre de Michael Corleone en la vida real antes de convertirse en un inmigrante italiano?",
        options: ["Vito", "Salvatore", "Andrea", "Michele"],
        correct: "Salvatore",
        difficulty: "muy difícil",
        category: "historia"
      }
    ]
  }
};

export default movieData;