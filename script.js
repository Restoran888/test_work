// =====================================================
// МОБИЛЬНОЕ МЕНЮ
// =====================================================

const mobileButton = document.querySelector(".mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

if (mobileButton && mobileMenu) {
    mobileButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        mobileButton.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });

    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
            mobileButton.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    });
}


// =====================================================
// ФОРМА БРОНИРОВАНИЯ
// =====================================================

const bookingForm = document.querySelector(".booking__form");

if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            return;
        }

        const name = document.querySelector("#name").value.trim();
        const date = document.querySelector("#date").value;
        const time = document.querySelector("#time").value;
        const guests = document.querySelector("#guests").value;

        const guestsText =
            guests === "1" ? "1 человека" :
            guests >= "2" && guests <= "4" ? `${guests} человека` :
            `${guests} человек`;

        const successMessage = document.createElement("div");
        successMessage.className = "booking-success";

        successMessage.innerHTML = `
            <div class="booking-success__window">
                <button class="booking-success__close" type="button" aria-label="Закрыть">×</button>

                <span class="booking-success__label">ЗАЯВКА ПРИНЯТА</span>

                <h3>
                    До встречи,<br>
                    ${escapeHtml(name)}.
                </h3>

                <p>
                    Столик на ${guestsText}<br>
                    ожидает вас ${date} в ${time}.
                </p>

                <span class="booking-success__note">
                    Это демонстрационная версия сайта.
                </span>
            </div>
        `;

        document.body.appendChild(successMessage);
        document.body.classList.add("menu-open");
        bookingForm.reset();
        phoneInput.value = "+7 ";

        const closeSuccess = () => {
            successMessage.remove();
            document.body.classList.remove("menu-open");
        };

        successMessage
            .querySelector(".booking-success__close")
            .addEventListener("click", closeSuccess);

        successMessage.addEventListener("click", (event) => {
            if (event.target === successMessage) {
                closeSuccess();
            }
        });

        document.addEventListener("keydown", function escapeHandler(event) {
            if (event.key === "Escape") {
                closeSuccess();
                document.removeEventListener("keydown", escapeHandler);
            }
        });
    });
}

function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    }[char]));
}


// =====================================================
// ФИЛЬТРАЦИЯ МЕНЮ
// =====================================================

const menuTabs = document.querySelectorAll(".menu-tab");
const menuItems = document.querySelectorAll(".menu-item");

menuTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
        const category = this.dataset.category;

        menuTabs.forEach((button) => {
            button.classList.remove("active");
        });

        this.classList.add("active");

        menuItems.forEach((item) => {
            const itemCategory = item.dataset.category;

            if (category === "all" || itemCategory === category) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });
    });
});


// =====================================================
// КАЛЕНДАРЬ
// =====================================================

const dateInput = document.querySelector("#date");

if (dateInput && typeof flatpickr !== "undefined") {
    flatpickr(dateInput, {
        locale: flatpickr.l10ns.ru,
        dateFormat: "d.m.Y",
        minDate: "today",
        disableMobile: true,
        animate: true,
        monthSelectorType: "static",
        allowInput: false
    });
}


// =====================================================
// ВЫБОР ВРЕМЕНИ
// =====================================================

const timeInput = document.querySelector("#time");

if (timeInput && typeof flatpickr !== "undefined") {
    flatpickr(timeInput, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        minuteIncrement: 30,
        minTime: "07:00",
        maxTime: "21:30",
        disableMobile: true,
        animate: true,
        allowInput: false
    });
}


// =====================================================
// ТЕЛЕФОН
// +7 (999) 999-99-99
// =====================================================

const phoneInput = document.querySelector("#phone");

function formatPhone(value) {
    let digits = value.replace(/\D/g, "");

    // Если пользователь вставил номер с 8 или +7 — оставляем только 10 цифр после кода.
    if (digits.startsWith("8")) {
        digits = digits.slice(1);
    } else if (digits.startsWith("7")) {
        digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);

    let result = "+7";

    if (digits.length > 0) result += " (" + digits.slice(0, 3);
    if (digits.length >= 3) result += ")";
    if (digits.length > 3) result += " " + digits.slice(3, 6);
    if (digits.length > 6) result += "-" + digits.slice(6, 8);
    if (digits.length > 8) result += "-" + digits.slice(8, 10);

    return result;
}

if (phoneInput) {
    phoneInput.value = "+7 ";

    phoneInput.addEventListener("input", () => {
        phoneInput.value = formatPhone(phoneInput.value);
        phoneInput.setCustomValidity("");
    });

    phoneInput.addEventListener("focus", () => {
        if (!phoneInput.value || phoneInput.value === "+7") {
            phoneInput.value = "+7 ";
        }
    });

    phoneInput.addEventListener("blur", () => {
        const digits = phoneInput.value.replace(/\D/g, "");

        if (digits.length !== 11) {
            phoneInput.setCustomValidity("Введите полный номер телефона");
        } else {
            phoneInput.setCustomValidity("");
        }
    });

    phoneInput.addEventListener("keydown", (event) => {
        const start = phoneInput.selectionStart ?? 0;

        if (
            (event.key === "Backspace" || event.key === "Delete") &&
            start <= 3
        ) {
            event.preventDefault();
        }
    });
}
