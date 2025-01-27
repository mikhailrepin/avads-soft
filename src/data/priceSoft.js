import prodSoft from "./prodSoft.json";

const priceData = {
  tsdb: {
    prices: {
      headers: [
        { clients: 2, label: "клиента" },
        { clients: 10, label: "клиентов" },
        { clients: 30, label: "клиентов" },
        { clients: 100, label: "клиентов" },
        { clients: "∞", label: "неограниченно" },
      ],
      rows: [
        {
          tags: 100,
          prices: [6800, 10200, 13600, 20400, 27200],
        },
        {
          tags: 500,
          prices: [15000, 22500, 30000, 45000, 60000],
        },
      ],
    },
    buttons: {
      buy: {
        label: "Купить",
        link: "/downloads/#tsdb",
      },
      demo: {
        label: "Скачать демо",
        link: "/downloads/#tsdb",
      },
      more: {
        label: "Подробнее ",
        link: "/tsdb",
      },
    },
  },
  // Здесь можно добавить ценовые данные для других продуктов
};

export const priceSoft = {
  products: prodSoft.products
    .map((product) => {
      const productData = priceData[product.id];
      if (!productData) return null;

      return {
        id: product.id,
        anchorName: product.app.name,
        app: {
          ...product.app,
          status: product.app.status || null,
        },
        prices: productData.prices,
        buttons: productData.buttons,
      };
    })
    .filter(Boolean) // Удаляем null значения
    .filter((product) => product.prices), // Показываем только продукты с ценами
};
