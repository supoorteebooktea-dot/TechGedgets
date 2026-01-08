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

const newProducts = [
  {
    name: 'Webcam 4K com Microfone',
    description: 'Webcam profissional com resolução 4K, microfone integrado com cancelamento de ruído e suporte para tripé. Ideal para streaming e videoconferências.',
    price: '249.90',
    originalPrice: '399.90',
    category: 'Câmeras',
    stock: 12,
    featured: true,
    imageUrl: '/images/accessories-flat-lay.jpg',
    rating: 4.8,
    reviews: 127,
  },
  {
    name: 'Teclado Mecânico RGB',
    description: 'Teclado mecânico com switches hot-swappable, iluminação RGB personalizável e software de configuração avançado. Perfeito para gaming e produtividade.',
    price: '189.90',
    originalPrice: '299.90',
    category: 'Periféricos',
    stock: 18,
    featured: true,
    imageUrl: '/images/accessories-flat-lay.jpg',
    rating: 4.9,
    reviews: 234,
  },
  {
    name: 'Mouse Sem Fio Ergonômico',
    description: 'Mouse ergonômico sem fio com bateria de longa duração, 6 botões programáveis e sensor de alta precisão. Conforto máximo para longas sessões.',
    price: '79.90',
    originalPrice: '129.90',
    category: 'Periféricos',
    stock: 35,
    featured: false,
    imageUrl: '/images/accessories-flat-lay.jpg',
    rating: 4.7,
    reviews: 189,
  },
];

try {
  for (const product of newProducts) {
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
  console.log('\n✅ Todos os 3 novos produtos foram adicionados com sucesso!');
} catch (error) {
  console.error('❌ Erro ao adicionar produtos:', error);
} finally {
  await connection.end();
}
