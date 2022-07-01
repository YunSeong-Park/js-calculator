// <reference types="cypress" />

const defaultValue = "0";
const operations = ["-", "+", "/", "X"];

describe("calculator", () => {
  const clickDigit = (number) => cy.get(".digit").contains(number).click();
  const clickAC = () => cy.get(".modifier").contains("AC").click();
  const clickOperation = (operation) =>
    cy.get(".operation").contains(operation).click();
  const clickEqual = () => cy.get("#equal-sign").click();
  const getTotal = () => cy.get("#total");

  beforeEach(() => {
    cy.visit("/");
  });

  it("total은 defaultValue(0)으로 렌더", () => {
    getTotal().should("have.text", defaultValue);
  });

  describe("입력", () => {
    describe("숫자", () => {
      it("0은 클릭하더라도 default value에서 변화 없음", () => {
        clickDigit("0");
        clickDigit("0");

        getTotal().should("have.text", defaultValue);
      });

      it("1 - 9, 1회 입력하면 해당 숫자가 total에 렌더", () => {
        for (let i = 1; i < 10; i++) {
          clickDigit(i.toString());
          getTotal().should("have.text", i.toString());
          clickAC();
        }
      });

      it("3자리 숫자까지는 입력하면 total에 렌더", () => {
        clickDigit("9");
        clickDigit("0");
        clickDigit("5");
        getTotal().should("have.text", "905");
      });

      it("4자리 숫자를 입력하면 입력되지 않고 alert 실행 -- 요구사항", () => {
        clickDigit("1");
        clickDigit("4");
        clickDigit("0");
        clickDigit("0");

        getTotal().should("have.text", "140");
        cy.on("window:alert", (t) => {
          //assertions
          expect(t).to.contains("숫자는 세 자리까지만 입력 가능합니다!");
        });
      });
    });

    describe("연산자", () => {
      it("숫자를 입력한 후 연산자를 입력하면 화면에 렌더", () => {
        operations.forEach((operation) => {
          clickDigit("3");
          clickOperation(operation);
          getTotal().should("have.text", `3${operation}`);
          clickAC();
        });
      });

      it("숫자를 입력하지 않고 연산자를 입력하면 alert 실행", () => {
        clickOperation("-");
        cy.on("window:alert", (t) => {
          expect(t).to.contains("숫자를 먼저 입력한 후 연산자를 입력해주세요!");
        });
      });

      it("연산자를 입력하고 연산자를 입력하면 alert 실행", () => {
        clickDigit("3");
        clickOperation("-");
        clickOperation("+");
        cy.on("window:alert", (t) => {
          expect(t).to.contains("숫자를 먼저 입력한 후 연산자를 입력해주세요!");
        });
      });
    });

    it("All Clear버튼을 누르면 초기화 -- 요구사항", () => {
      clickDigit("1");
      clickDigit("8");
      clickOperation("-");

      clickAC();

      getTotal().should("have.text", defaultValue);
    });
  });

  describe("연산 -- 요구사항", () => {
    it("2개의 숫자에 대해 덧셈이 가능하다", () => {
      clickDigit("4");
      clickOperation("+");
      clickDigit("1");
      clickDigit("3");

      clickEqual();

      getTotal().should("have.text", 17);
    });

    describe("뺄셈", () => {
      it("2개의 숫자에 대해 뺄셈이 가능하다", () => {
        clickDigit("4");
        clickOperation("-");
        clickDigit("2");
        clickEqual();
        getTotal().should("have.text", 2);
      });

      it("뺄셈은 음수를 반환할 수 있다", () => {
        clickDigit("3");
        clickOperation("-");
        clickDigit("5");
        clickEqual();
        getTotal().should("have.text", -2);
      });
    });

    it("2개의 숫자에 대해 곱셈이 가능하다.", () => {
      clickDigit("3");
      clickOperation("X");
      clickDigit("9");
      clickEqual();
      getTotal().should("have.text", 27);
    });

    it("2개의 숫자에 대해 나눗셈이 가능하다.", () => {
      clickDigit("9");
      clickOperation("/");
      clickDigit("3");
      clickEqual();
      getTotal().should("have.text", 3);
    });

    it("계산 결과를 표현할 때 소수점 이하는 버림한다.", () => {
      clickDigit("7");
      clickOperation("/");
      clickDigit("2");
      clickEqual();
      getTotal().should("have.text", 3);
    });
  });
});