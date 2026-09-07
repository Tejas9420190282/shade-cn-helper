// componentCatalog.js

const { components } = require("../data/components");

function getAll() {
  return components;
}

function getById(componentId) {
  return components.find((component) => component.id === componentId);
}

function search(query) {
  if (!query) {
    return components;
  }

  const searchText = query.toLowerCase();

  return components.filter((component) => {
    return (
      component.name.toLowerCase().includes(searchText) ||
      component.id.toLowerCase().includes(searchText) ||
      component.category.toLowerCase().includes(searchText)
    );
  });
}

function getByCategory(category) {
  return components.filter((component) => component.category === category);
}

function getDependencies(componentId) {
  const component = getById(componentId);

  if (!component) {
    return {
      components: [],
      packages: [],
    };
  }

  return {
    components: component.dependencies?.components || [],

    packages: component.dependencies?.packages || [],
  };
}

module.exports = {
  getAll,
  getById,
  search,
  getByCategory,
  getDependencies,
};
