(function ($) {
  "use strict";

  const iconLabels = {
    "ti-pencil-alt": "Kemaskini rekod",
    "ti-trash": "Hapus rekod",
    "ti-arrow-left": "Kembali",
    "ti-plus": "Tambah rekod",
    "ti-check": "Simpan",
    "ti-close": "Tutup",
    "fa-download": "Muat turun",
    "fa-trash": "Hapus",
  };

  function enhanceContent(root) {
    const $root = $(root || document);

    $root.find("img:not([alt])").attr("alt", "");
    $root.find("table").addClass("table-hover");

    $root.find("button, a.button").each(function () {
      const $control = $(this);
      if ($control.attr("aria-label") || $.trim($control.text())) return;

      const classList = $control.find("i").attr("class") || "";
      Object.keys(iconLabels).some(function (iconClass) {
        if (classList.indexOf(iconClass) === -1) return false;
        $control.attr({
          "aria-label": iconLabels[iconClass],
          title: iconLabels[iconClass],
        });
        return true;
      });
    });

    if ($.fn.tooltip) {
      $root.find('[data-toggle="tooltip"]').tooltip({ container: "body" });
    }

    if ($.fn.select2) {
      $root.find("select.select2").each(function () {
        const $select = $(this);
        if ($select.hasClass("select2-hidden-accessible")) return;
        const $modal = $select.closest(".modal");
        $select.select2({
          width: "100%",
          dropdownParent: $modal.length ? $modal : $(document.body),
        });
      });
    }
  }

  function filterMenu(query) {
    const term = $.trim(query).toLowerCase();
    const $items = $("#side-header-menu li");

    if (!term) {
      $items.removeClass("media-search-hidden");
      return;
    }

    $items.each(function () {
      const $item = $(this);
      const ownText = $.trim($item.children("a").first().text()).toLowerCase();
      $item.toggleClass("media-search-hidden", ownText.indexOf(term) === -1);
    });

    $items.filter(":not(.media-search-hidden)").parents("li").removeClass("media-search-hidden");
  }

  function restoreActiveMenu() {
    const content = window.sessionStorage.getItem("content");
    if (!content) {
      $("#home").parent("li").addClass("active");
      return;
    }

    const target = content.split("/").pop();
    const $target = $("#side-header-menu #" + target);
    if (!$target.length) return;

    const $parents = $target.parents("li");
    $target.parent("li").addClass("active");
    $parents.addClass("active");
    $parents.children("ul.side-header-sub-menu").show();
    $parents
      .children("a")
      .attr("aria-expanded", "true")
      .find(".menu-expand i")
      .removeClass("zmdi-chevron-down")
      .addClass("zmdi-chevron-up");
  }

  $(function () {
    enhanceContent(document);
    restoreActiveMenu();

    $("#admin-menu-search-form").on("submit", function (event) {
      event.preventDefault();
      filterMenu($("#admin-menu-search").val());
    });

    $("#admin-menu-search").on("input", function () {
      filterMenu(this.value);
    });

    $("#side-header-menu").on("click", "a[id]", function () {
      if ($(this).siblings(".side-header-sub-menu").length) return;
      $("#side-header-menu li").removeClass("active");
      $(this).parents("li").addClass("active");
    });

    $(document).on("click", "[data-admin-target]", function () {
      const target = $(this).data("admin-target");
      const $target = $("#" + target);
      if ($target.length) $target.trigger("click");
    });

    const content = document.getElementById("content");
    if (content && window.MutationObserver) {
      let scheduled = false;
      new MutationObserver(function () {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(function () {
          enhanceContent(content);
          scheduled = false;
        });
      }).observe(content, { childList: true, subtree: true });
    }
  });
})(jQuery);
