import { FC } from "react";
import { ItemProps } from "./ItemProps";
'use strict';
export const handleSave = async (props: ItemProps): Promise<void> => {
    const { idx, val, data, catNames, setEditableIndex, setData2 } = props;
    try {
        const response = await fetch(`http://192.168.0.108:8000/update/${val}/${data.id}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json()).catch((err) => console.error(err));
        console.log(`response`, response);
        setEditableIndex(null);
        setData2((prevData) => ({...prevData, [catNames[idx]] : data}));
    } catch (err) {
        console.error(err);
        
    }
}

export const handleEdit = async (props: ItemProps): Promise<void> => {
    const { setEditableIndex, idx, setDeleteBtn, catValues, setData, setSelect, select } = props;
    setEditableIndex(idx);
    setDeleteBtn(false);
    const result = catValues[idx];
    setData(result);
    const keys = [];
    Object.keys(result).map((key) => {typeof result[key] === 'object' && keys.push(key);});
    keys.map(async (e) => {
        const response = await fetch(`http://192.168.0.108:8000/getSelect/${e}`).then((res) => res.json()).catch((err) => console.error(err));
        response.status === 200 && setSelect((prevData : any) => ({...prevData, [e] : response.schema}));
        console.log(`response`, response);
    })
    console.log(`select`, select);
}

export const handleDelete = async (props: ItemProps): Promise<void> => {
    const { itemId, idx, setDeleteBtn, catValues, setResults , catNames, val } = props;
  
    setDeleteBtn(false);
    const updatedStates = [...catValues];
    if (idx !== -1) {
      updatedStates.splice(idx, 1);
      setResults((prevData : any) => ({...prevData, [catNames]: updatedStates }));
    }
    console.log(`props`, props)
    const response = await fetch(`http://192.168.0.108:8000/delete/${val}/${itemId}`).then((res) => res.json()).catch((err) => console.error(err));
    console.log(`[response delete]`, response);
  }

export const handleDeleteAll = async (props: ItemProps): Promise<void> => {
    const { setProcessing1, setEditableIndex, setToasty, setData2, catNames, setDeleteBtn, deleteBtn, val } = props;
    setProcessing1(true);
    setEditableIndex(null);
    await new Promise((resolve) => {setTimeout(resolve, 1000)});
    const response = await fetch(`http://192.168.0.108:8000/deleteAll/${val}`).then((res) => res.json()).catch((err) => console.error(err));
    console.log(`[response deleteAll]`, response);
    setToasty({vis: true, text: response.message, status: 'success'});
    response.status === 200 && setData2((prevData) => ({...prevData, [catNames]: [] }));
    (window as any).toasty.showModal();
    setProcessing1(false);
    setDeleteBtn(!deleteBtn);
}

export const handlePrint = async (props: ItemProps) : Promise<void> => {
    const { setDeleteBtn, val } = props;

    setDeleteBtn(false);
    const printableContent = document.getElementById('printable-content/' + val);
    const printableContentClone = printableContent.cloneNode(true);

    const noPrint = (printableContentClone as Element).querySelectorAll('.no-print');
    noPrint.forEach((e: any) => e.remove());
  
    const printWindow = window.open('', 'Print', 'width=1200,height=800');
    printWindow.document.write('<html><head><title>YanS Print</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      /* Add your custom CSS rules here */
      body {
        font-family: Arial, sans-serif;
      }
      .print-heading {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .print-content {
        font-size: 14px;
        line-height: 1.5;
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<div class="print-heading">YanS Print</div>');
    printWindow.document.write('<div class="print-content">');
    printWindow.document.write((printableContentClone as HTMLElement).innerHTML);
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    printWindow.addEventListener('afterprint', () => {
      printWindow.close();
    });
    printWindow.print();

}

export const  handleDoubleClick = async (result: any, props: ItemProps) : Promise<void> => {
    const { setDeleteBtn, val, setChosen, setResults, setVal, results } = props;
    console.log(`result`, result);
    setDeleteBtn(false);
    console.log(`result id`, result.id);
    console.log(`result name`, result.name);
    const chosenName = Object.keys(results)[val];
    setChosen((prevData) => ({...prevData, [chosenName] : { ...prevData[chosenName], id: result.id, name: result.name } }));
    const response = await fetch(`http://192.168.0.108:8000/getFiltered/${val}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: result.id, name: result.name }),
    }).then((res) => res.json()).catch((err) => console.error(err));
    console.clear();
    console.log(`response double click`, response);
    console.log(`debug 1`);
    if (val === 2) {
      console.log(`debug 2`);
      setResults({...results, product: response.schema});
      setVal(5);
    }
    else {
      console.log(`debug 3`);
      setResults((prevData) => ({ ...prevData, [Object.keys(results)[val + 1]]: response.schema }));
      setVal(val + 1);
    }
    console.log(`debug 4`);
    
}

export const handleSubmitVtoroNivo = async (props: ItemProps) : Promise<void>  => {
    const { wrong, val, data2, setWrong, setProcessing, setOpen, setData2 } = props;
    setProcessing(true);

    const neshte = 'Не сте избрали ';

    const catName = Object.keys(data2)[val];
    const catValues = Object.values(data2)[val];
    await new Promise((resolve) => {setTimeout(resolve, 1000)});
    const response = await fetch(`http://192.168.0.108:8000/create/${val}`, {
        method: 'POST',
        body: JSON.stringify(catValues),
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json()).catch((err) => console.error(err));
    console.log(`responseaaaaaaaaaaaa`, response);
    setProcessing(false);

    setData2((prevData) => ({...prevData, [catName] : { ...prevData[catName], text: '' }}));

    if (response.status === 200) {
        setWrong((prevWrong : any) => {
            return {
              ...prevWrong,
              surovini: { ...prevWrong.surovini, is: false, txt: '' },
              vtoro: { ...prevWrong.vtoro, is: false, txt: '' },
              treto: { ...prevWrong.treto, is: false, txt: '' },
              kontragent: { ...prevWrong.kontragent, is: false, txt: '' },
              supplier: { ...prevWrong.supplier, is: false, txt: '' },
              product: { ...prevWrong.product, is: false, txt: '' },
            };
          });
          
          
    }

    else if (response.status === 400) {
        setWrong((prevWrong) => ({...prevWrong, [catName]: { ...prevWrong[catName], is: true, txt: response.message }}));
    }
    else if (response.status === 500) {
        setWrong((prevWrong) => ({...prevWrong, [catName]: { ...prevWrong[catName], is: true, txt: response.message }}));
    }
}

export const fetchData = async (setResults: ItemProps['setResults'], chosen : ItemProps['chosen']) : Promise<void> => {
  console.log(`chosen`, chosen);
  try {
  const response = await fetch(`http://192.168.0.108:8000/getAll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chosen),
  });
  const data : any = await response.json();
  console.log(`data`, data.surovini, `typeof`, typeof data.surovini);
  console.log(`da eba majka ti da eba `, data);
  setResults((prevResults) => ({...prevResults, surovini : data.surovini, vtoro : data.vtoro, treto: data.treto, kontragent: data.kontragent, supplier: data.supplier, product: data.products}));

  console.log(`data`, data);
  } catch (err) {
    console.log(err);
  }
}
