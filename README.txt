COMO FAZER UM POEMA CUCALIMGUÍSTICO — SITE V2

Arquivos principais:
- index.html
- styles.css
- poems.js
- app.js

O que mudou nesta versão:
- ordem aleatória das 31 variações, persistida em localStorage;
- conjunto ampliado de botões, sem repetição durante o percurso e com mudança gradual de tom;
- deterioração visual progressiva conforme o visitante avança: fundo, rachaduras, bordas e fragmentos;
- colagem com imagens livres: gramática, tesoura e saco de papel;
- a referência à tradução portuguesa foi removida;
- créditos autorais e link da cucalimguistica foram incluídos;
- fontes das imagens livres aparecem em “créditos”;
- o último botão continua sendo “FIM?” e abre a versão em branco do visitante.

IMPORTANTE SOBRE AS IMAGENS
Nesta versão, as imagens livres são carregadas diretamente dos acervos de origem (Library of Congress e Wikimedia Commons). Portanto, para vê-las é necessária conexão com a internet. O site continua funcional sem elas.

Para editar poemas e títulos:
- poems.js

Para editar os rótulos dos botões:
- app.js, objeto labelGroups

Para ajustar a intensidade da deterioração:
- styles.css, seção “V2 — percurso, deterioração progressiva e colagem de objetos”


V3
- Fundo escurece monotonicamente a cada avanço do percurso.
- Rachaduras: 12 redes, reveladas progressivamente e mais profundas.
- Apenas a imagem da tesoura permanece; ela cruza a página e cresce conforme o percurso.
- A versão em branco final ocupa o mesmo palco dos poemas, sem área vazia intermediária.
- Chaves de localStorage atualizadas para v3.
