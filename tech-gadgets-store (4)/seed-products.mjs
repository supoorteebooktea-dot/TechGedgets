import mysql from 'mysql2/promise';

// Parse DATABASE_URL format: mysql://user:password@host:port/database?ssl={...}
const dbUrl = new URL(process.env.DATABASE_URL || 'mysql://root:password@localhost:4000/test');
const connection = await mysql.createConnection({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 4000,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

const products = [
  {
    name: 'Mini Projetor 4K Portátil',
    description: 'Projetor portátil com resolução 4K, 3000 lumens de brilho e contraste 10000:1. Perfeito para cinema em casa, apresentações e entretenimento.',
    price: '349.90',
    originalPrice: '599.90',
    category: 'Projetores',
    stock: 15,
    featured: true,
    imageUrl: '/images/projector-hero.jpg',
    rating: 4.9,
    reviews: 342,
  },
  {
    name: 'Luminária LED Screenbar',
    description: 'Luminária inteligente para monitor que reduz o cansaço visual. Iluminação ambiente automática que se adapta ao seu ambiente.',
    price: '129.90',
    originalPrice: '199.90',
    category: 'Iluminação',
    stock: 25,
    featured: true,
    imageUrl: '/images/accessories-flat-lay.jpg',
    rating: 4.8,
    reviews: 218,
  },
  {
    name: 'Carregador Portátil 65W USB-C',
    description: 'Carregador rápido com potência de 65W, compatível com múltiplos dispositivos. Design compacto e leve, perfeito para viagens.',
    price: '89.90',
    originalPrice: '149.90',
    category: 'Carregadores',
    stock: 40,
    featured: true,
    imageUrl: '/images/accessories-flat-lay.jpg',
    rating: 4.7,
    reviews: 156,
  },
  {
    name: 'Suporte Ajustável para Smartphone',
    description: 'Suporte de alumínio com ajuste de 360°. Ideal para vídeos, lives e produção de conteúdo.',
    price: '59.90',
    originalPrice: '99.90',
    category: 'Acessórios',
    stock: 30,
    featured: false,
    imageUrl: '/images/accessories-flat-lay.jpg',
    rating: 4.7,
    reviews: 156,
  },
  {
    name: 'Fone de Ouvido Bluetooth Premium',
    description: 'Fone com cancelamento de ruído ativo, bateria de 30 horas e som de alta qualidade. Conforto máximo para longas sessões.',
    price: '199.90',
    originalPrice: '349.90',
    category: 'Fones',
    stock: 20,
    featured: true,
    imageUrl: '/images/accessories-flat-lay.jpg',
    rating: 4.9,
    reviews: 289,
  },
  {
    name: 'Smartwatch Fitness Tracker',
    description: 'Relógio inteligente com monitoramento de saúde, GPS integrado e resistência à água. Acompanhe seus treinos e saúde em tempo real.',
    price: '279.90',
    originalPrice: '449.90',
    category: 'Wearables',
    stock: 18,
    featured: true,
    imageUrl: '/images/accessories-flat-lay.jpg',
    rating: 4.8,
    reviews: 203,
  },
];

try {
  for (const product of products) {
    await connection.execute(
      `INSERT INTO products (name, description, price, originalPrice, category, stock, featured, imageUrl, rating, reviews, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        product.name,
        product.description,
        product.price,
        product.originalPrice,
        product.category,
        product.stock,
        product.featured ? 1 : 0,
        product.imageUrl,
        product.rating,
        product.reviews,
      ]
    );
    console.log(`✓ Produto adicionado: ${product.name}`);
  }
  console.log('\n✅ Todos os 6 produtos foram adicionados com sucesso!');
} catch (error) {
  console.error('❌ Erro ao adicionar produtos:', error);
} finally {
  await connection.end();
}
