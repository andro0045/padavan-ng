/**
 * Dropdown Library with selected items display
 * created for https://github.com/nilabsent/padavan-ng
 *
 * Version: beta2
 * Author:  nil
 * Licence: licenced under MIT licence (http://opensource.org/licenses/MIT)
 */
(($) => {
	$.fn.multiSelectDropdown = function (methodOrOptions, ...args) {
		const methods = {
			init: function (options) {
				const settings = $.extend(
					{
						placeholder: "Add item...",
						items: [],
						onChange: null,
						allowDelete: true,
						allowAdd: true,
						allowCheck: true,
						removeSpaces: false,
						addSuggestionText: "Add",
						allowedItems: null,
						allowedAlert: "",
						width: null,
					},
					options,
				);

				return this.each(function () {
					const $wrapper = $(this).addClass("msd-dropdown");
					$wrapper.data("settings", settings);

					if (settings.width) {
						$wrapper.css("width", settings.width);
					}

					$wrapper.html(`
<div class="msd-header">
  <input type="text" class="msd-input"
    placeholder="${settings.placeholder}"
    autocomplete="off" spellcheck="false" />
  <div class="msd-chevron" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 26 26">
      <polyline points="6 12 12 18 18 12"
        fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</div>
<div class="msd-content" style="display:none;">
  <div class="msd-item-list"></div>
</div>
`);
					const $input = $wrapper.find(".msd-input");
					const $content = $wrapper.find(".msd-content");
					const $itemList = $wrapper.find(".msd-item-list");

					const $addSuggestion = $(
						'<div class="msd-add-suggestion" style="display:none;"></div>',
					).prependTo($itemList);

					function getAllItemTexts() {
						return $itemList
							.children(".msd-item")
							.map(function () {
								return $(this).data("item-text");
							})
							.get();
					}

					function getDisplayItems() {
						if (settings.allowCheck) {
							return $wrapper.data("selectedItems") || [];
						}
						return getAllItemTexts();
					}

					function hasSomethingToShow() {
						const visibleItems = $itemList
							.children(".msd-item")
							.filter(function () {
								return this.style.display !== "none";
							}).length;
						const suggestionVisible =
							$addSuggestion.length > 0 &&
							$addSuggestion[0].style.display !== "none";
						return visibleItems > 0 || suggestionVisible;
					}

					function updateSelected(forceTrigger = false) {
						let selected = [];

						if (settings.allowCheck) {
							selected = $itemList
								.find('input[type="checkbox"]:checked')
								.map(function () {
									return this.value;
								})
								.get();
						} else {
							selected = getAllItemTexts();
						}

						if (selected.length) {
							$input.val(selected.join(", "));
						} else {
							$input.val("");
						}
						$input.prop("placeholder", settings.placeholder);

						const prevSelected = $wrapper.data("selectedItems") || [];
						$wrapper.data("selectedItems", selected);

						if (settings.allowAdd) {
							$itemList.children(".msd-item").show();
						}

						if (
							(forceTrigger ||
								prevSelected.length !== selected.length ||
								prevSelected.some((v, i) => v !== selected[i])) &&
							typeof settings.onChange === "function"
						) {
							settings.onChange.call($wrapper, selected);
						}
					}

					function createItem(text, checked = false, title) {
						const $container = $("<div>").addClass("msd-item");
						$container.data("item-text", text);
						$container.data("item-title", title || "");

						if (settings.allowDelete) {
							const $delete = $(`
<button type="button" class="msd-delete">
  <svg viewBox="0 0 10 10">
    <line x1="2" y1="2" x2="8" y2="8"/>
    <line x1="8" y1="2" x2="2" y2="8"/>
  </svg>
</button>
`).on("click", (e) => {
								e.stopPropagation();
								$container.remove();
								updateSelected(true);

								if (!hasSomethingToShow()) {
									$content.hide();
									$wrapper.removeClass("msd-open msd-show");
								}
							});
							$container.append($delete);
						}

						const $label = $("<label>").addClass("msd-label");

						if (settings.allowCheck) {
							const $checkbox = $(
								'<input type="checkbox" style="margin: 3px 0 3px 0;">',
							)
								.val(text)
								.prop("title", title)
								.prop("checked", checked)
								.on("change", () => {
									updateSelected();
								});
							$label.append($checkbox);
						}

						$label.append($("<span>").text(text));
						$label.append($("<span>").addClass("msd-title").text(title));
						$container.append($label);

						$itemList.append($container);
					}

					function showDropdown(fromInput) {
						if (!fromInput) {
							$itemList.children(".msd-item").show();
							$addSuggestion.hide();
						}

						if (!hasSomethingToShow()) {
							$content.hide();
							$wrapper.removeClass("msd-open msd-show");
							return;
						}

						$(".msd-dropdown.msd-show")
							.not($wrapper)
							.removeClass("msd-open msd-show")
							.find(".msd-content")
							.hide();

						$content.show();
						$wrapper.addClass("msd-open msd-show");
					}

					function hideDropdown() {
						$wrapper.removeClass("msd-open msd-show");
						$content.hide();
						$itemList.children(".msd-item").show();
						$addSuggestion.hide();

						const displayItems = getDisplayItems();
						if (displayItems.length) {
							$input.val(displayItems.join(", "));
						} else {
							$input.val("");
						}
						$input.prop("placeholder", settings.placeholder);
					}

					function handleInput() {
						const query = $input.val().trim();
						const queryLower = query.toLowerCase();

						if (!query) {
							$addSuggestion.hide();
							$itemList.children(".msd-item").show();
							showDropdown(true);
							return;
						}

						let exactMatch = false;
						$itemList.children(".msd-item").each(function () {
							let txt = $(this).text().toLowerCase();
							let q = queryLower;

							if (settings.removeSpaces) {
								txt = txt.replace(/\s+/g, "");
								q = q.replace(/\s+/g, "");
							}

							const match = $(this).text().toLowerCase().includes(queryLower);
							$(this).toggle(match);

							if (txt === q) {
								exactMatch = true;
							}
						});

						if (settings.allowAdd && !exactMatch) {
							$addSuggestion
								.text(`${settings.addSuggestionText} "${query}"`)
								.show();
						} else {
							$addSuggestion.hide();
						}

						showDropdown(true);
					}

					function tryAddItem(val) {
						if (!val) return;

						if (settings.removeSpaces) {
							val = val.replace(/\s+/g, "");
						}

						if (!val) return;

						if (settings.allowedItems) {
							const regex = new RegExp(settings.allowedItems);
							if (!regex.test(val)) {
								if (settings.allowedAlert) {
									alert(settings.allowedAlert);
								}
								return;
							}
						}

						const $existingItems = $itemList.children(".msd-item");
						const exists = $existingItems.toArray().some((el) => {
							let existing = $(el).data("item-text") || "";
							if (
								existing === "" &&
								$(el).find('input[type="checkbox"]').length
							) {
								existing = $(el).find('input[type="checkbox"]').val();
							}
							existing = (existing || "").toLowerCase();
							let newVal = val.toLowerCase();
							if (settings.removeSpaces) {
								existing = existing.replace(/\s+/g, "");
								newVal = newVal.replace(/\s+/g, "");
							}
							return existing === newVal;
						});

						if (!exists) {
							createItem(val, true);
						}

						updateSelected(true);
						$input.val("");
						$input.prop("placeholder", "");
						$addSuggestion.hide();
						handleInput();
					}

					$wrapper.data("multiSelectDropdown", {
						createItem,
						updateSelected,
						$itemList,
						$input,
					});

					if (settings.allowAdd) {
						$input
							.on("input", handleInput)
							.on("keydown", (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									tryAddItem($input.val().trim());
								}
							})
							.on("focus", () => {
								const displayItems = getDisplayItems();
								const canShow =
									$itemList.children(".msd-item").length > 0 ||
									settings.allowAdd;

								if (canShow) {
									$input.prop("placeholder", "");
									if (displayItems.length > 0) {
										$input.val("");
									}
								}
								showDropdown(false);
							});

						$addSuggestion.on("click", () => {
							tryAddItem($input.val().trim());
							$input.focus();
						});
					} else {
						$input.prop("readonly", true).on("focus", () => {
							showDropdown(false);
						});
					}

					$(document).on("keydown", (e) => {
						if (e.key === "Escape" && $wrapper.hasClass("msd-show")) {
							e.preventDefault();
							hideDropdown();
							updateSelected();
							document.activeElement.blur();
						}
					});

					$wrapper.find(".msd-chevron").on("click", (e) => {
						e.stopPropagation();
						if ($wrapper.hasClass("msd-show")) {
							hideDropdown();
						} else {
							showDropdown(false);
							if ($wrapper.hasClass("msd-show")) $input.focus();
						}
					});

					$wrapper.find(".msd-header").on("click", (e) => {
						if (!$(e.target).closest(".msd-chevron").length) {
							showDropdown(false);
							if ($wrapper.hasClass("msd-show")) $input.focus();
						}
					});

					$(window).on("mousedown", (e) => {
						if (!$(e.target).closest($wrapper).length) {
							hideDropdown();
							updateSelected();
						}
					});

					settings.items.forEach((item) => {
						if (typeof item === "string") {
							createItem(item, false);
						} else if (item && typeof item === "object" && item.text) {
							createItem(item.text, !!item.checked, item.title);
						}
					});

					updateSelected(false);
				});
			},

			getSelected: function () {
				return this.data("selectedItems") || [];
			},

			getAllItemTexts: function () {
				const inst = this.data("multiSelectDropdown");
				if (inst) {
					return inst.$itemList
						.children(".msd-item")
						.map(function () {
							return $(this).data("item-text");
						})
						.get();
				}
				return [];
			},

			getAllItems: function () {
				const inst = this.data("multiSelectDropdown");
				if (inst) {
					return inst.$itemList
						.children(".msd-item")
						.map(function () {
							const $item = $(this);
							const $checkbox = $item.find('input[type="checkbox"]');
							return {
								text: $item.data("item-text"),
								title: $item.data("item-title") || "",
								checked: $checkbox.length ? $checkbox.prop("checked") : false,
							};
						})
						.get();
				}
				return [];
			},

			setSelected: function (values) {
				const inst = this.data("multiSelectDropdown");
				if (inst) {
					inst.$itemList.find('input[type="checkbox"]').each(function () {
						$(this).prop("checked", values.includes(this.value));
					});
					inst.updateSelected();
				}
			},

			addItem: function (text, checked) {
				const inst = this.data("multiSelectDropdown");
				if (inst) {
					inst.createItem(text, !!checked);
					inst.updateSelected();
				}
			},

			setPlaceholder: function (text) {
				return this.each(function () {
					const settings = $(this).data("settings");
					if (settings) {
						settings.placeholder = text;
					}
					const inst = $(this).data("multiSelectDropdown");
					if (inst?.$input) {
						inst.$input.prop("placeholder", text);
					}
				});
			},
		};

		if (methods[methodOrOptions]) {
			return methods[methodOrOptions].apply(this, args);
		} else if (typeof methodOrOptions === "object" || !methodOrOptions) {
			return methods.init.call(this, methodOrOptions);
		} else {
			$.error(
				`Method ${methodOrOptions} not found in multiSelectDropdown`
			);
		}
	};
})(jQuery);
