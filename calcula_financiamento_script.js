// Seu código JavaScript aqui

function normalizaDecimalPtBr(valor) {
  return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

function comp_financiamento(nparcelas, taxa, valor, periodo, tipo) {
  var i = normalizaDecimalPtBr(taxa) / 100;
  var parcelas = [];
  var totalPago = 0;

  if (tipo == "sac") {
    var amortizacao = normalizaDecimalPtBr(valor) / nparcelas;
    var saldoDevedor = normalizaDecimalPtBr(valor);

    for (var j = 1; j <= nparcelas; j++) {
      var juros = saldoDevedor * i;
      var parcela = amortizacao + juros;
      saldoDevedor -= amortizacao;

      totalPago += parcela;
      parcelas.push({
        numero: j,
        parcela: parcela.toFixed(2),
        amortizacao: amortizacao.toFixed(2),
        juros: juros.toFixed(2),
        saldoDevedor: saldoDevedor.toFixed(2)
      });
    }
  } else if (tipo == "price") {
    var pmt = normalizaDecimalPtBr(valor) * (i / (1 - Math.pow(1 + i, -nparcelas)));
    var saldoDevedor = normalizaDecimalPtBr(valor);

    for (var j = 1; j <= nparcelas; j++) {
      var juros = saldoDevedor * i;
      var amortizacao = pmt - juros;
      saldoDevedor -= amortizacao;

      totalPago += pmt;
      parcelas.push({
        numero: j,
        parcela: pmt.toFixed(2),
        amortizacao: amortizacao.toFixed(2),
        juros: juros.toFixed(2),
        saldoDevedor: saldoDevedor.toFixed(2)
      });
    }
  }

  return { parcelas: parcelas, totalPago: totalPago.toFixed(2) };
}

function limpaZeradoParaInput(inp) {
  if (inp.value == "0,00" || inp.value == "0" || inp.value == "0,00%") {
    inp.value = "";
  }
}

function calculaTabelaUp(evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode == 13) {
    calculaTabela();
  } else if (charCode < 35 || charCode > 40) {
    // esconde a tabela de resultado
    $("#sac_result").hide();
    $("#erro_input").hide();
    $("#botao_solicite").hide();
    $("#botao_taxas_imoveis").hide();
  }
}

function calculaTabela(semEvento) {
  var calculatorform = document.forms.calculator_sac;
  if (calculatorform.anp.value == "0" || calculatorform.apv.value == "0,00") {
    $("#erro_input").show();
    $("#sac_result").hide();
    $("#botao_solicite").hide();
    $("#botao_taxas_imoveis").hide();
    return;
  }

  var resultado = comp_financiamento(calculatorform.anp.value, normalizaDecimalPtBr(calculatorform.air.value), normalizaDecimalPtBr(calculatorform.apv.value), calculatorform.periodo.value, calculatorform.tipo.value);
  if (!resultado.semErro) {
    $("#erro_input").show();
    return;
  }

  $("#sac_result").show();
  $("#erro_input").hide();
  resultado.botaoSolicite ? $("#botao_solicite").show() : $("#botao_solicite").hide();
  resultado.botaoTaxasImoveis ? $("#botao_taxas_imoveis").show() : $("#botao_taxas_imoveis").hide();

  var tabela = document.getElementById("tabela_resultado");
  tabela.innerHTML = "<tr class='alt'><th>#</th><th>Parcelas</th><th>Amortizações</th><th>Juros</th><th>Saldo Devedor</th></tr>";

  resultado.parcelas.forEach(function (parcela, index) {
    var rowClass = (index % 2 === 0) ? "" : "alt";
    tabela.innerHTML += "<tr class='" + rowClass + "'><th>" + parcela.numero + "</th><td>" + parcela.parcela + "</td><td>" + parcela.amortizacao + "</td><td>" + parcela.juros + "</td><td>" + parcela.saldoDevedor + "</td></tr>";
  });

  tabela.innerHTML += "<tr><th> » </th><td>" + resultado.totalPago + "</td><td>" + normalizaDecimalPtBr(calculatorform.apv.value).toFixed(2) + "</td><td>" + (resultado.totalPago - normalizaDecimalPtBr(calculatorform.apv.value)).toFixed(2) + "</td><th>« TOTAIS</th></tr>";
}

$("#sac_result").hide();
$("#erro_input").hide();
$("#botao_solicite").hide();
$("#botao_taxas_imoveis").hide();
