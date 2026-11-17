/* =====================================================================
   BLACK KAYÁ 2026 · o que o Pedro pode mudar sem mexer no resto
   ===================================================================== */
window.KAYA = {
  /* VAGAS QUE RESTAM (mudar a cada fechamento) */
  vagasPlano: 3, // de 3
  vagasSites: 5, // de 5

  /* WhatsApp que recebe as conversas (com 55 + DDD) */
  whatsapp: "5531987740537",

  /* Pixel do Meta (o mesmo da LP da Kayá Saúde). Vazio = sem pixel. */
  pixel: "1787591898956072",

  /* true = mostra os avisos de "⏳ falta" (só para conferir).
     Antes de publicar, trocar para false. */
  rascunho: false,

  /* Números do Do Jardim: só aparecem no ar com a autorização deles. */
  doJardimAutorizado: true, // autorizado pelo Pedro em 16/11/2026

  /* Vídeos gravados pelo Pedro (verticais, dentro da pasta video/).
     "previa" é um trecho curto e leve, sem som, que toca sozinho na página.
     O "arquivo" completo só carrega quando a pessoa toca para ouvir.
     Exemplo: { arquivo: "/blackfriday/video/do-jardim.mp4", previa: "/blackfriday/video/do-jardim-previa.mp4", capa: "/blackfriday/video/do-jardim.jpg", legenda: "Do Jardim · anúncio" } */
  videos: [
    { arquivo: "/blackfriday/video/dojardim.mp4", previa: "/blackfriday/video/dojardim-previa.mp4", capa: "/blackfriday/video/dojardim.jpg", legenda: "Do Jardim · anúncio" },
    { arquivo: "/blackfriday/video/magna-rosa.mp4", previa: "/blackfriday/video/magna-rosa-previa.mp4", capa: "/blackfriday/video/magna-rosa.jpg", legenda: "Magna Mater · entrevista" },
    { arquivo: "/blackfriday/video/miguel-arcanjo.mp4", previa: "/blackfriday/video/miguel-arcanjo-previa.mp4", capa: "/blackfriday/video/miguel-arcanjo.jpg", legenda: "Escola Miguel Arcanjo · anúncio" },
    { arquivo: "/blackfriday/video/magna-teatree.mp4", previa: "/blackfriday/video/magna-teatree-previa.mp4", capa: "/blackfriday/video/magna-teatree.jpg", legenda: "Magna Mater · produto" },
    { arquivo: "/blackfriday/video/carolina-colours.mp4", previa: "/blackfriday/video/carolina-colours-previa.mp4", capa: "/blackfriday/video/carolina-colours.jpg", legenda: "Carolina Colours · institucional" },
  ],
};
