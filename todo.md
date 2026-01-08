# Tech Gadgets Store - E-Commerce Dropshipping TODO

## Fase 1: Estrutura Base e Design
- [x] Inicializar projeto web-db-user com tRPC
- [x] Configurar paleta de cores (roxo/índigo) e tipografia (Playfair Display + Sora)
- [x] Criar layout base com navegação responsiva
- [x] Implementar tema claro/escuro com CSS variables

## Fase 2: Schema de Banco de Dados
- [x] Criar tabela de produtos (id, nome, descrição, preço, imagem_url, estoque, categoria)
- [x] Criar tabela de pedidos (id, user_id, status, total, data_criação)
- [x] Criar tabela de itens_pedido (id, pedido_id, produto_id, quantidade, preço_unitário)
- [x] Criar tabela de endereços (id, user_id, rua, número, complemento, cidade, estado, cep)
- [x] Criar tabela de histórico_pedidos (id, pedido_id, status_anterior, status_novo, data)
- [x] Implementar migrations com drizzle-kit

## Fase 3: Catálogo de Produtos
- [x] Criar página inicial com hero section
- [x] Implementar grid de produtos com cards (imagem, nome, preço, avaliação)
- [x] Criar página de detalhes do produto (descrição completa, features, reviews)
- [x] Implementar filtros por categoria e ordenação por preço
- [x] Adicionar busca de produtos

## Fase 4: Sistema de Carrinho
- [x] Implementar carrinho com localStorage (frontend)
- [x] Criar componente de carrinho no header
- [x] Adicionar funcionalidade de adicionar/remover produtos
- [x] Calcular subtotal, impostos e total
- [x] Implementar persistência do carrinho

## Fase 5: Autenticação e Perfil do Usuário
- [x] Integrar Manus OAuth (já configurado)
- [x] Criar página de perfil do usuário
- [x] Implementar gerenciamento de endereços de entrega (API)
- [x] Criar histórico de pedidos do usuário

## Fase 6: Checkout e Processamento de Pedidos
- [x] Criar página de checkout com formulário de endereço
- [x] Validar dados do formulário
- [x] Implementar seleção de método de entrega
- [x] Criar procedimento tRPC para criar pedido
- [x] Salvar pedido no banco de dados com status "pendente_pagamento"

## Fase 7: Integração Stripe
- [x] Configurar credenciais Stripe
- [x] Implementar Stripe Elements para captura de cartão
- [x] Criar procedimento tRPC para processar pagamento
- [x] Implementar webhook para confirmação de pagamento
- [x] Atualizar status do pedido após pagamento bem-sucedido

## Fase 8: Notificações por E-mail
- [x] Configurar credenciais Gmail
- [x] Implementar envio de email de confirmação de pedido
- [x] Implementar envio de email com código de rastreio
- [x] Criar templates de email profissionais
- [x] Adicionar notificação ao proprietário sobre novo pedido

## Fase 9: Painel Administrativo
- [x] Criar página /admin protegida (apenas admin)
- [x] Implementar listagem de todos os pedidos
- [x] Criar interface para atualizar status de pedido
- [x] Implementar visualização de detalhes do pedido
- [x] Criar dashboard com estatísticas (vendas, pedidos, clientes)
- [x] Adicionar gerenciamento de produtos (criar, editar, deletar)

## Fase 10: Upload e Armazenamento de Imagens (S3)
- [x] Configurar credenciais AWS S3
- [x] Implementar upload de imagens no painel admin
- [x] Criar procedimento tRPC para upload
- [x] Salvar URL da imagem no banco de dados
- [x] Implementar validação de tipo e tamanho de arquivo

## Fase 11: Testes e Validação
- [x] Testar fluxo completo de compra (sem pagamento real)
- [x] Testar integração Stripe com cartões de teste
- [x] Testar envio de emails
- [x] Testar upload de imagens
- [x] Testar responsividade em mobile/tablet/desktop
- [x] Validar segurança (autenticação, autorização)

## Fase 12: Deploy e Publicação

- [x] Criar checkpoint final
- [x] Preparar variáveis de ambiente
- [x] Fazer deploy na Vercel
- [x] Testar site em produção
- [x] Configurar domínio customizado (opcional)
## Requisitos Técnicos
- **Stack:** React 19 + Tailwind 4 + Express 4 + tRPC 11 + Drizzle ORM
- **Banco de Dados:** TiDB (MySQL compatible)
- **Autenticação:** Manus OAuth
- **Pagamento:** Stripe
- **E-mail:** Gmail
- **Armazenamento:** AWS S3
- **Hospedagem:** Vercel

## Notas de Design
- Paleta de cores: Roxo/Índigo (oklch) como primária
- Tipografia: Playfair Display (títulos), Sora (corpo)
- Estilo: Premium tech store, minimalista, whitespace estratégico
- Componentes: shadcn/ui com animações suaves
- Responsividade: Mobile-first approach


## Fase 13: Redesign Visual (Novo Modelo)
- [x] Analisar layout do modelo fornecido
- [x] Adaptar página inicial para seguir estrutura do modelo
- [x] Atualizar seções de benefícios e produtos
- [x] Integrar imagens do modelo
- [x] Ajustar cores e posicionamento
- [x] Testar responsividade com novo design
- [x] Mudar cores de azul para roxo/índigo
- [x] Adicionar 6 produtos (Luminária, Projetor, Carregador, etc)
- [x] Adicionar chamadas de atenção com percentual de desconto
- [x] Implementar página de detalhes do produto


## Fase 14: Melhorias Visuais e UX (Feedback do Desenvolvedor)

- [x] Mudar paleta de cores para roxo em todo o site (backgrounds, borders, accents)
- [x] Alinhar e melhorar botões dos produtos (tamanho, espaçamento, hover effects)
- [x] Adicionar feedback visual (loading states, transitions, animations)
- [x] Melhorar espaçamento e alinhamento dos cards de produtos
- [x] Adicionar 3 novos produtos ao banco de dados
- [x] Melhorar responsividade em mobile
- [x] Adicionar transações suaves entre páginas
- [x] Implementar skeleton loaders para dados assíncronos
