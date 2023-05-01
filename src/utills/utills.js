export default function createElement(tag, props) {
  const { attributes = {}, classNames = [], children = '' } = props;
  const el = document.createElement(tag);

  Object.entries(attributes).forEach(([attr, value]) => {
    el.setAttribute(attr, value);
  });

  el.classList.add(...classNames);

  el.innerHTML = children;

  return el;
}
