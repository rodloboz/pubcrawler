import { toggleDateInputs } from './crawls_form';

const reactToModalChange = function() {
  const modalObserver = new MutationObserver(toggleDateInputs);
  const modal = document.getElementById('mainModal');
  const observerOptions = {
    childList: true,
    subtree : true,
    attributes: false,
    characterData : false
  };

  modalObserver.observe(modal, observerOptions);
};

export { reactToModalChange };
