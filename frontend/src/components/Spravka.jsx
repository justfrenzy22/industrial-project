import React, { useState, useRef, useEffect } from 'react';

const Spravka = ({ isOpen, setOpen, toasty, setToasty }) => {
  if (!isOpen) return null;

  const [buttons, setButtons] = useState({
    txt: ['surovini', 'vtoro', 'treto', 'kontragent', 'supplier', 'product'],
    is: null,
  });

  const [results, setResults] = useState({
    surovini: null,
    vtoro: null,
    treto: null,
    kontragent: null,
    supplier: null,
    product: null,
  });
  const [isProcessing, setProcessing] = useState(false);
  const [isProcessing1, setProcessing1] = useState(false);
  const [disabled, setDisabled] = useState(null);
  const [editable, setEditable] = useState(false); 
  const [editableIndex, setEditableIndex] = useState(null);
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [select, setSelect] = useState(null);
  const [data, setData] = useState(null);
  const handleNameChange = async (event, id) => {
    const newName = event.target.textContent;
    const category = buttons.txt[buttons.is];
    const updatedResults = {
      ...results,
      [category]: results[category].map((result) => {
        if (result._id === id) {
          return { ...result, name: newName };
        }
        return result;
      }),
    };
    setResults(updatedResults);
  };

  const handleSave = async (idx) => {

    console.log(`data`, data);
    const response = await fetch(`http://192.168.0.102:8000/update/${buttons.is}/${data._id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json()).catch((err) => console.error(err));
    console.log(`response`, response);
    setEditableIndex(null);
    setResults((prevResults) => ({...prevResults, [buttons.txt[buttons.is][idx]] : data }));
  };

  const nameInputRefs = useRef([]);


  const handleTable = async () => {
    setDeleteBtn(false);
    setProcessing(true);
    setEditableIndex(null);
    setData(null);
    await new Promise((resolve) => {setTimeout(resolve, 1000);});

    const category = buttons.txt[buttons.is];
    const response = await fetch(`http://192.168.0.102:8000/geta/${buttons.is}`)
      .then((res) => res.json())
      .catch((err) => console.error(err));
  
    setResults((prevResults) => ({
      ...prevResults,
      [category]: response.results,
    }));
    setProcessing(false);
  };
  
  useEffect(() => {
    handleTable();
  }, [buttons.is]);



  const handleDelete = async (itemId, idx) => {
    setDeleteBtn(false);
    console.log(`asdsad`, itemId, idx)
    const category = buttons.txt[buttons.is];
    const updatedStates = [...results[category]];

    if (idx !== -1) {
      updatedStates.splice(idx, 1);
    }

    setResults((prevResults) => ({...prevResults, [category] : updatedStates }));
    const response = await fetch(`http://192.168.0.102:8000/delete/${buttons.is}/${itemId}`).then((res) => res.json()).catch((err) => console.error(`errir`, err));
    console.log(`[Response spravka delete]`, response);
  };

  const handleDeleteAll = async () => {
    setProcessing1(true);
    setEditableIndex(null);
    await new Promise((resolve) => {setTimeout(resolve, 1000);});
    const response = await fetch(`http://192.168.0.102:8000/deleteAll/${buttons.is}`).then((res) => res.json()).catch((err) => console.error(err));
    console.log(`resp`, response);

    setToasty({ vis: true, text: response.message })
    window.toast.showModal();

    response.status === 200 &&  setResults((prevResults) => ({...prevResults, [buttons.txt[buttons.is]] : null }));
    setProcessing1(false);
    setDeleteBtn(!deleteBtn);
  }

  const handleEdit = async (id, idx) => {
    setEditableIndex(idx);
    setDeleteBtn(false);
    const category = buttons.txt[buttons.is];
    console.clear();
    const result = results[category][idx];
    setData(result);
    const keys = [];
    console.log(`result`, result)
    Object.keys(result).map((key) => {typeof result[key] === 'object' && keys.push(key); });
    keys.map(async (e) => {
      const response = await fetch(`http://192.168.0.102:8000/getSelect/${e}`).then((res) => res.json()).catch((err) => console.error(err));
      response.status === 200 && setSelect((prevData) => ({...prevData, [e] : response.schema}));
      console.log(`response`, response);
    })

    console.log(`i se pregrushtame`, select);

  }

  const handlePrint = () => {
    setDeleteBtn(false);
    const printableContent = document.getElementById(`printable-content`);
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
    printWindow.document.write('<div class="print-heading">Printable Content</div>');
    printWindow.document.write('<div class="print-content">');
    printWindow.document.write(printableContent.innerHTML);
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    printWindow.addEventListener('afterprint', () => {
      printWindow.close();
    });
    printWindow.print();
  };

  return (
    <div className="flex flex-col justify-center items-center " >
      <div className="flex flex-col sm:flex-row gap-2 mb-5 max-w-screen mt-[6rem]">
        {buttons.txt.map((e, idx) => (
          <button className={`btn rounded-full ${ disabled === idx ? 'disabled' : '' }`}  key={idx} onClick={() => {
            setButtons({ ...buttons, is: idx });
            handleTable();
          }}> { isProcessing && buttons.is === idx ? <span className='loading loading-spinner'  /> : <div>{e} ({results && results[e] && results[e].length})</div>} </button>
        ))}
      </div>
      <div className='flex flex-row' >
      <label className='label'>
        <span className='label-text'>
          {buttons.is === 0 ? 'surovini' : `${buttons.txt[buttons.is]}`} (
          {results[buttons.txt[buttons.is]] ? results[buttons.txt[buttons.is]].length : '0'})
        </span>
      </label>
      {
        deleteBtn ? <button className={` ml-3 btn btn-sm rounded-full ${isProcessing1 ? 'loading loading-spinner' : ''} `} onClick={() => handleDeleteAll()} >{isProcessing1 ? 'Loading...' : 'Изтрий всички'}</button> :
        <button className='ml-3 btn btn-sm rounded-full btn-circle' onClick={() => setDeleteBtn(!deleteBtn)} >x</button>
      }
      { isProcessing || buttons.is === null ? <div className='ml-8 btn btn-sm rounded-full' ><span className='loading loading-dots loading-xs' /></div> : <button className='ml-3 btn btn-sm rounded-full ' onClick={() => handlePrint()} >Принтирай</button>}
      </div>

      { buttons.is !== null &&
        <div className="overflow-x-auto max-w-screen" id='printable-content'>
          { isProcessing ? <div className='my-8' ><span className='loading loading-spinner loading-xs mr-3' />Зареждане...</div> :
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Номер</th>
                {buttons.is !== null && results[buttons.txt[buttons.is]] && results[buttons.txt[buttons.is]].length > 0 && results[buttons.txt[buttons.is]][0] ? (
                  Object.keys(results[buttons.txt[buttons.is]][0]).map((key, index) => {
                    if (key !== '_id' && key !== '__v') {
                      return <th key={index}>{key}</th>;
                    }
                    return null;
                  })
                ) : null}
                <th>Промяна / Изтриване</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {results[buttons.txt[buttons.is]] && Array.isArray(results[buttons.txt[buttons.is]]) && results[buttons.txt[buttons.is]].length > 0 ? (
                results[buttons.txt[buttons.is]].map((result, idx) => (
                  <tr key={result._id}>
                    <td>
                      <div className='flex items-center space-x-3'>№{idx + 1}</div>
                    </td>
                    {Object.keys(result).map((e, indx) => {
                      if (e !== '_id' && e !== '__v') {
                        return (
                          <td key={indx}>
                            <div className='flex items-center space-x-3'>
                              {editableIndex === idx ? (
                                <>
                                  {typeof result[e] === 'object' && result[e] !== null && result[e].name !== null ? (
                                    <select className='select select-ghost select-md w-full'
                                      onChange={(event) => {
                                        setData((prevData) => ({
                                          ...prevData, [e]: event.target.value
                                        }))
                                      }}
                                    >
                                      { select && select[e] && select[e].map((res) => (
                                        <option key={res._id} value={res._id}>{res.name}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <div
                                      contentEditable
                                      onInput={(event) => {
                                        console.log(`event`, event.target.innerHTML);
                                        setData((prevData) => ({
                                          ...prevData, [e]: event.target.textContent
                                        }))
                                      }}
                                    >
                                      {result[e]}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div>
                                  {typeof result[e] === 'object' && result[e] !== null && result[e].name !== null ? result[e].name : result[e]}
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      }
                      return null;
                    })}
                    <th>
                      {editableIndex === idx ? (
                        <div>
                          <button className="btn btn-ghost btn-xs" onClick={() => handleSave(idx)}>Save</button>
                          <button className='btn btn-ghost btn-xs' onClick={() => setEditableIndex(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div>
                          <button className="btn btn-ghost btn-xs" onClick={() => handleEdit(result._id, idx)}>Edit</button>
                          <button className='btn btn-ghost btn-xs' onClick={() => handleDelete(result._id, idx)}>Delete</button>
                        </div>
                      )}
                    </th>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>
                    Няма открити артикули от {buttons.txt[buttons.is]}
                  </td>
                </tr>
              )}

            </tbody>
          </table> }
        </div> }
        { console.log(results) }
    </div>
  );
};

export default Spravka;