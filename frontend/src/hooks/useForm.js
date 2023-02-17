import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const useForm = (initialForm, validateForm, paymentData) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  let nav = useNavigate();

  const blockLetters = (newVal) => {
    let valArr = newVal.split("");
    let valLength = newVal.length;
    let lastValDigit = valArr[valLength - 1];

    return lastValDigit != undefined && isNaN(Number.parseInt(lastValDigit))
      ? true
      : false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newVal = value;
    let newValArr = newVal.split("");
    let newLength = newVal.length;
    let lastNewDigit = newValArr[newLength - 1];
    let oldVal = form[name];
    let oldLength = oldVal.length;

    if (name == "expiration") {
      if (oldLength == 1 && newLength == 2 && newValArr[1] == "/") {
        let saving1digit = newValArr[0];
        let buildNewArr = ["0", saving1digit, "/"];
        newVal = buildNewArr.join("");
      } else if (
        !(oldLength == 2 && newLength == 3 && lastNewDigit == "/") &&
        !(oldLength == 4 && newLength == 3) &&
        blockLetters(newVal)
      )
        return;
      else if (oldLength == 1 && newLength == 2) newVal = newVal.concat("/");
      else if (oldLength == 4 && newLength == 3) {
        let deletingSlashAnd2Digit = [newValArr[0], newValArr[1]].join("");
        newVal = deletingSlashAnd2Digit;
      } else if (oldLength == 2 && newLength == 3) {
        let saving3digit = newValArr[2];
        if (lastNewDigit != "/") {
          newValArr[2] = "/";
          newVal = newValArr.join("").concat(saving3digit);
        }
      }
    } else if (name == "idCard") {
      if (
        !(
          newLength == 5 ||
          newLength == 10 ||
          (newLength == 15 && newLength < oldLength && lastNewDigit == " ")
        ) &&
        blockLetters(newVal)
      )
        return;
      else if (
        (newLength == 4 || newLength == 9 || newLength == 14) &&
        newLength > oldLength
      ) {
        newValArr.push(" ");
        newVal = newValArr.join("");
        lastNewDigit = " ";
        newLength = newLength++;
        oldLength = oldLength++;
      } else if (
        (newLength == 5 || newLength == 10 || newLength == 15) &&
        newLength > oldLength &&
        lastNewDigit != " "
      ) {
        newValArr[newLength - 1] = " ";
        newValArr.push(lastNewDigit);
        newVal = newValArr.join("");
      } else if (
        (newLength == 5 ||
          newLength == 10 ||
          newLength == 15 ||
          newLength == 4 ||
          newLength == 9 ||
          newLength == 14) &&
        newLength < oldLength
      ) {
        newValArr.pop();
        newVal = newValArr.join("");
      }
    } else if (name == "cvc") {
      if (blockLetters(newVal)) return;
    }

    setForm({
      ...form,
      [name]: newVal,
    });
  };

  const handleBlur = (e) => {
    setErrors(validateForm(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios
      .post("http://127.0.0.1:8000/api/pago/", paymentData)
      .then((response) =>
        Swal.fire({
          title: "¡Haz pagado tu factura!",
          text: `Se desconto $${paymentData.monto} a tu tarjeta`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            return nav("/Cliente/home");
          }
        })
      )
      .catch((error) =>
        Swal.fire({
          title: "Ha ocurrido un error al realizar tu pago",
          text: "Vuelve a intentarlo",
          icon: "error",
          confirmButtonColor: "red",
          confirmButtonText: "Salir",
        }).then((result) => {
          if (result.isConfirmed) {
            console.log(error);
          }
        })
      );
  };

  return {
    form,
    errors,
    loading,
    response,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
