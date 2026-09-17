/* =====================================================
   PHARMDISPO237 - LOGIQUE MÉTIER & INTERFACE
====================================================== */

/* =====================================================
   1. ELEMENTS DOM
====================================================== */

const header = document.getElementById("header");
const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");
const backTop = document.getElementById("backTop");
const searchForm = document.getElementById("searchForm");
const resultsContainer = document.getElementById("resultsContainer");
const resultsGrid = document.getElementById("resultsGrid");
const contactForm = document.getElementById("contactForm");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");

/* =====================================================
   2. MENU MOBILE
====================================================== */

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    const icon = menuToggle.querySelector("i");
    if (icon) {
      if (navMenu.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    }
  });

  /* Fermer le menu après clic */
  document.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  });
}

/* =====================================================
   3. HEADER AU SCROLL
====================================================== */

window.addEventListener("scroll", () => {
  if (header) {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  /* Bouton retour haut */
  if (backTop) {
    if (window.scrollY > 500) {
      backTop.classList.add("show");
    } else {
      backTop.classList.remove("show");
    }
  }
});

/* =====================================================
   4. RETOUR EN HAUT
====================================================== */

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* =====================================================
   5. BASE DE DONNEES DEMO
====================================================== */

interface Pharmacy {
  name: string;
  city: string;
  quartier: string;
  medicine: string;
  status: "available" | "limited" | "unavailable";
  statusText: string;
  quantity: string;
  distance: string;
}

const pharmacies: Pharmacy[] = [
  {
    name: "Pharmacie du Centre",
    city: "Yaoundé",
    quartier: "Centre-ville",
    medicine: "Paracétamol",
    status: "available",
    statusText: "Disponible",
    quantity: "Stock disponible",
    distance: "1,2 km",
  },
  {
    name: "Pharmacie Santé Plus",
    city: "Yaoundé",
    quartier: "Bastos",
    medicine: "Paracétamol",
    status: "limited",
    statusText: "Stock limité",
    quantity: "Quelques unités",
    distance: "3,4 km",
  },
  {
    name: "Pharmacie Espoir",
    city: "Yaoundé",
    quartier: "Mvan",
    medicine: "Paracétamol",
    status: "unavailable",
    statusText: "Rupture",
    quantity: "Indisponible",
    distance: "5,8 km",
  },
  {
    name: "Pharmacie de la Gare",
    city: "Bertoua",
    quartier: "Centre-ville",
    medicine: "Amoxicilline",
    status: "available",
    statusText: "Disponible",
    quantity: "Stock disponible",
    distance: "0,9 km",
  },
  {
    name: "Pharmacie Soleil",
    city: "Bertoua",
    quartier: "Ekombitié",
    medicine: "Ibuprofène",
    status: "available",
    statusText: "Disponible",
    quantity: "Stock disponible",
    distance: "2,1 km",
  },
  {
    name: "Pharmacie Moderne",
    city: "Douala",
    quartier: "Akwa",
    medicine: "Paracétamol",
    status: "available",
    statusText: "Disponible",
    quantity: "Stock disponible",
    distance: "1,5 km",
  },
  {
    name: "Pharmacie Bon Secours",
    city: "Douala",
    quartier: "Bonamoussadi",
    medicine: "Metformine",
    status: "limited",
    statusText: "Stock limité",
    quantity: "Quelques unités",
    distance: "4,2 km",
  },
  {
    name: "Pharmacie La Santé",
    city: "Bafoussam",
    quartier: "Centre-ville",
    medicine: "Artemether-Lumefantrine",
    status: "available",
    statusText: "Disponible",
    quantity: "Stock disponible",
    distance: "1,7 km",
  },
  {
    name: "Pharmacie du Marché",
    city: "Garoua",
    quartier: "Centre",
    medicine: "Paracétamol",
    status: "limited",
    statusText: "Stock limité",
    quantity: "Quelques unités",
    distance: "2,8 km",
  },
];

/* =====================================================
   6. NORMALISATION DES TEXTES
====================================================== */

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/* =====================================================
   7. RECHERCHE DE MEDICAMENT
====================================================== */

if (searchForm) {
  searchForm.addEventListener("submit", function (event: Event) {
    event.preventDefault();

    const medicineInputEl = document.getElementById("medicine") as HTMLInputElement | null;
    const cityInputEl = document.getElementById("city") as HTMLSelectElement | null;

    const medicineInput = medicineInputEl ? medicineInputEl.value : "";
    const cityInput = cityInputEl ? cityInputEl.value : "";

    const medicine = normalizeText(medicineInput);
    const city = normalizeText(cityInput);

    if (!medicine) {
      showToast(
        "Recherche incomplète",
        "Veuillez saisir le nom d'un médicament."
      );
      return;
    }

    /* Recherche */
    const results = pharmacies.filter((pharmacy) => {
      const pharmacyMedicine = normalizeText(pharmacy.medicine);
      const pharmacyCity = normalizeText(pharmacy.city);

      const medicineMatch =
        pharmacyMedicine.includes(medicine) ||
        medicine.includes(pharmacyMedicine);

      const cityMatch = !city || pharmacyCity === city;

      return medicineMatch && cityMatch;
    });

    displayResults(results, medicineInput, cityInput);
  });
}

/* =====================================================
   8. AFFICHAGE DES RESULTATS
====================================================== */

function displayResults(results: Pharmacy[], medicine: string, city: string) {
  if (!resultsContainer || !resultsGrid) return;

  resultsContainer.classList.add("show");

  if (results.length === 0) {
    resultsGrid.innerHTML = `
      <div class="no-result" style="grid-column:1/-1;">
        <i class="fa-solid fa-circle-info"
           style="font-size:25px; color:#087EA4; margin-bottom:10px;">
        </i>
        <p>
          Aucun résultat de démonstration trouvé
          pour <strong>${escapeHTML(medicine)}</strong>
          ${city ? "à <strong>" + escapeHTML(city) + "</strong>" : ""}.
        </p>
        <small>
          Essayez par exemple : Paracétamol, Amoxicilline, Ibuprofène ou Metformine.
        </small>
      </div>
    `;
    return;
  }

  resultsGrid.innerHTML = results
    .map((pharmacy) => {
      return `
        <article class="pharmacy-result">
          <div class="pharmacy-top">
            <div>
              <div class="pharmacy-name">
                ${escapeHTML(pharmacy.name)}
              </div>
              <div class="pharmacy-location">
                <i class="fa-solid fa-location-dot"></i>
                ${escapeHTML(pharmacy.city)}
                —
                ${escapeHTML(pharmacy.quartier)}
              </div>
            </div>
            <span class="status ${pharmacy.status}">
              ● ${escapeHTML(pharmacy.statusText)}
            </span>
          </div>

          <div class="medicine-name">
            <i class="fa-solid fa-pills"></i>
            ${escapeHTML(pharmacy.medicine)}
          </div>

          <div class="pharmacy-meta">
            <span>
              <i class="fa-solid fa-box"></i>
              ${escapeHTML(pharmacy.quantity)}
            </span>
            <span>
              <i class="fa-solid fa-route"></i>
              ${escapeHTML(pharmacy.distance)}
            </span>
          </div>

          <div class="result-actions">
            <button
              type="button"
              onclick="showPharmacyDetails('${escapeHTML(pharmacy.name)}')">
              <i class="fa-solid fa-circle-info"></i>
              Détails
            </button>

            <button
              type="button"
              onclick="showRoute('${escapeHTML(pharmacy.name)}')">
              <i class="fa-solid fa-diamond-turn-right"></i>
              Itinéraire
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  /* Faire défiler vers les résultats */
  setTimeout(() => {
    resultsContainer.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, 100);
}

/* =====================================================
   9. SECURISATION DES TEXTES
====================================================== */

function escapeHTML(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =====================================================
   10. DETAILS PHARMACIE
====================================================== */

export function showPharmacyDetails(name: string) {
  showToast(
    "Pharmacie sélectionnée",
    `${name} — Les informations détaillées seront disponibles dans la version connectée.`
  );
}

/* =====================================================
   11. ITINERAIRE
====================================================== */

export function showRoute(name: string) {
  showToast(
    "Itinéraire",
    `Le calcul d'itinéraire vers ${name} sera disponible avec l'intégration cartographique.`
  );
}

// Attach to window for inline onclick handlers
(window as unknown as { showPharmacyDetails: typeof showPharmacyDetails }).showPharmacyDetails = showPharmacyDetails;
(window as unknown as { showRoute: typeof showRoute }).showRoute = showRoute;

/* =====================================================
   12. NOTIFICATION TOAST
====================================================== */

let toastTimer: ReturnType<typeof setTimeout> | undefined;

function showToast(title: string, message: string) {
  if (!toast || !toastTitle || !toastMessage) return;

  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.classList.add("show");

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}

/* =====================================================
   13. VALIDATION FORMULAIRE CONTACT
====================================================== */

if (contactForm) {
  contactForm.addEventListener("submit", function (event: Event) {
    event.preventDefault();

    let valid = true;

    const name = document.getElementById("name") as HTMLInputElement | null;
    const email = document.getElementById("email") as HTMLInputElement | null;
    const subject = document.getElementById("subject") as HTMLSelectElement | null;
    const message = document.getElementById("message") as HTMLTextAreaElement | null;

    /* Reset */
    document.querySelectorAll(".error-message").forEach((error) => {
      error.classList.remove("show");
    });

    document.querySelectorAll(".form-control").forEach((input) => {
      input.classList.remove("error");
    });

    /* NOM */
    if (name && name.value.trim().length < 2) {
      const nameError = document.getElementById("nameError");
      if (nameError) showError(name, nameError);
      valid = false;
    }

    /* EMAIL */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.value.trim())) {
      const emailError = document.getElementById("emailError");
      if (emailError) showError(email, emailError);
      valid = false;
    }

    /* SUJET */
    if (subject && !subject.value) {
      const subjectError = document.getElementById("subjectError");
      if (subjectError) showError(subject, subjectError);
      valid = false;
    }

    /* MESSAGE */
    if (message && message.value.trim().length < 10) {
      const messageError = document.getElementById("messageError");
      if (messageError) showError(message, messageError);
      valid = false;
    }

    /* FORMULAIRE VALIDE */
    if (valid) {
      showToast(
        "Message envoyé",
        "Merci ! Votre message a bien été pris en compte par le prototype."
      );
      contactForm.reset();
    }
  });
}

/* =====================================================
   14. AFFICHER UNE ERREUR
====================================================== */

function showError(input: HTMLElement, error: HTMLElement) {
  input.classList.add("error");
  error.classList.add("show");
}

/* =====================================================
   15. ANIMATIONS AU SCROLL
====================================================== */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((el) => el.classList.add("active"));
}

/* =====================================================
   16. NAVIGATION ACTIVE
====================================================== */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const htmlSection = section as HTMLElement;
    const sectionTop = htmlSection.offsetTop - 150;
    const sectionHeight = htmlSection.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id") || "";
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === "#" + currentSection) {
      link.classList.add("active");
    }
  });
});

/* =====================================================
   17. AUTOCOMPLETION SIMPLE
====================================================== */

const medicineInput = document.getElementById("medicine") as HTMLInputElement | null;

if (medicineInput) {
  medicineInput.addEventListener("input", function (this: HTMLInputElement) {
    const value = normalizeText(this.value);

    if (value.length < 2) {
      return;
    }

    const suggestions = [
      ...new Set(
        pharmacies
          .map((item) => item.medicine)
          .filter((medicine) => normalizeText(medicine).includes(value))
      ),
    ];

    if (suggestions.length > 0) {
      this.setAttribute("list", "medicineSuggestions");

      let datalist = document.getElementById("medicineSuggestions");

      if (!datalist) {
        datalist = document.createElement("datalist");
        datalist.id = "medicineSuggestions";
        document.body.appendChild(datalist);
      }

      datalist.innerHTML = suggestions
        .map((item) => `<option value="${escapeHTML(item)}">`)
        .join("");
    }
  });
}

/* =====================================================
   18. PREVENTION DES LIENS "#"
====================================================== */

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(
      "Prototype",
      "Cette fonctionnalité sera disponible dans la version complète."
    );
  });
});

/* =====================================================
   19. MESSAGE CONSOLE
====================================================== */

console.log(
  "%cPharmDispo237",
  "font-size:25px;font-weight:bold;color:#0B8F55;"
);
console.log("Prototype HealthTech camerounais chargé avec succès.");
console.log("Les données affichées sont des données de démonstration.");
