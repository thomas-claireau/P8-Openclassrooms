/*global NodeList */
(function(window) {
	'use strict';

	/**
	 * Récupère un élément avec querySelector (qs) et le sélecteur CSS
	 * @module Helpers
	 * @function qs
	 * @param {string} selector - Le sélecteur css de l'élément
	 * @param {string} scope - Le scope de l'élément (si pas renseigné, document par défaut)
	 */
	window.qs = function(selector, scope) {
		return (scope || document).querySelector(selector);
	};

	/**
	 * Récupère plusieurs éléments avec querySelectorAll (qsa) et le sélecteur CSS
	 * @module Helpers
	 * @function qsa
	 * @param {string} selector - Le sélecteur css des éléments
	 * @param {string} scope - Le scope des éléments (si pas renseigné, document par défaut)
	 */
	window.qsa = function(selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	/**
	 * Ajoute un écouteur d'évènement à l'élément ciblé
	 * @module Helpers
	 * @function $on
	 * @param {element} target - L'élément ciblé
	 * @param {string} type - Le type de l'évènement (click, change...)
	 * @param {string} callback - La réponse en cas d'évènement
	 * @param {boolean} useCapture - indique si l'évènement est envoyé au listener enregistré avant d'être distribué à tout EventTarget (https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener)
	 */
	window.$on = function(target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};

	/**
	 * Ajoute un écouteur d'évènement à tous les éléments qui correspondent au sélecteur passé dans la fonction.
	 * @module Helpers
	 * @function $delegate
	 * @param {element} target - L'élément ciblé
	 * @param {string} selector - Le sélecteur css de l'élément ciblé
	 * @param {string} type - Le type de l'event
	 * @param {string} handler - Callback exécuté
	 */
	window.$delegate = function(target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = window.qsa(selector, target);
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

			if (hasMatch) {
				handler.call(targetElement, event);
			}
		}

		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		var useCapture = type === 'blur' || type === 'focus';

		window.$on(target, type, dispatchEvent, useCapture);
	};

	/**
	 * Trouve l'élément parent qui porte le tag suivant : $parent(qs('a'), 'div');
	 * @module Helpers
	 * @function $parent
	 * @param {element} element - L'élément ciblé
	 * @param {string} tagName - Le tag de l'élément ciblé
	 */
	window.$parent = function(element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	// Autorise les boucles sur les noeuds:
	// qsa('.foo').forEach(function () {})
	NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
