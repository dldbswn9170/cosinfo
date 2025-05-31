// 페이지 내용 전부 로드시 아래 코드 실행
document.addEventListener("DOMContentLoaded", function () {
    // 지금 보고 있는 페이지 구분
    const pageId = document.body.id;

    // 회원가입 페이지일 시 실행
    if (pageId === "register-page") {
        const form = document.querySelector(".login-form");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault(); // 페이지 새로고침 막기

            const formData = new FormData(form);

            fetch("register.php", {
                method: "POST",
                body: formData,
            })
            .then(response => response.text())
            .then(data => {
                alert(data); // 서버에서 온 메시지 보여주기

                if (data.includes("성공")){ // register.php의 회원가입 성공
                    window.location.href = "Login.html"; // 회원가입 성공 시 로그인 페이지로 이동
                }
            })
            .catch(error => {
                alert("에러가 발생했어요: " + error);
            });
        });

    // 로그인 페이지일 시 실행
    } else if (pageId === "login-page") {
        const form = document.querySelector(".login-form");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(form);

            fetch("login.php", {
                method: "POST",
                body: formData,
            })
            .then(response => response.text())
            .then(data => {
                alert(data); // 서버에서 온 메시지 보여주기
                window.location.href = "index.html"; // 로그인 후 메인 페이지로 이동
            })
            .catch(error => {
                alert("에러가 발생했어요: " + error);
            });
        });
    }
});
