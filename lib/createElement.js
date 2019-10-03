const createElement = () =>
  new Proxy(
    // target object to proxy
    {},
    // Handler object with a trap (get method)
    {
      // trap (get method)
      get(obj, tag) {
        return (props = {}, children = []) => {
          const element = document.createElement(tag);

          const event = key => key.substr(2).toLowerCase();

          Object.entries(props).forEach(([key, value]) => {
            key.startsWith("on") && typeof value === "function"
              ? element.addEventListener(event(key), value)
              : element.setAttribute(key, value);
          });

          if (!Array.isArray(children)) {
            children = [children];
          }

          children.map(child => {
            return typeof child === "string"
              ? (element.textContent = child)
              : element.appendChild(child);
          });
          return element;
        };
      }
    }
  );

export default createElement