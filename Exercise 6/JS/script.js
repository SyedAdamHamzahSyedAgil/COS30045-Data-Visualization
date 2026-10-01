document.addEventListener("DOMContentLoaded", function () {

    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const answer = this.nextElementSibling;
            const isOpen = this.classList.contains("open");

            faqQuestions.forEach(function (otherQuestion) {

                const otherAnswer = otherQuestion.nextElementSibling;

                otherQuestion.classList.remove("open");
                otherAnswer.style.display = "none";

            });

            if (!isOpen) {
                this.classList.add("open");
                answer.style.display = "block";
            }

        });

    });

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    

});