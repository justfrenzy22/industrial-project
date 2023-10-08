// export default function Kontragent ({handleSubmitVtoroNivo, wrong, isProcessing, setData2, isOpen, setOpen, val}) {
//     return (
//         <>
//             <form onSubmit={handleSubmitVtoroNivo} >
//                 <h3 className="font-bold text-lg mb-5 uppercase" >контрагенти</h3>
//                 <input type="text" required placeholder="контрагент" disabled={isProcessing} className={`input input-border w-full max-w-screen mb-5 ${wrong.kontragent.is ? 'input-error' : ''} `} 
//                   onChange={(e) => setData2((prevData) => ({...prevData, kontragent : {...prevData.kontragent, text: e.target.value}}))}/>
//                 { wrong.kontragent.is && <><span className="font-medium" >Опа! </span>{wrong.kontragent.txt}!</>}
//                 <div className="flex flex-row max-w-screen mt-5">
//                     <button className="w-[65%] btn btn-md btn-circle btn-ghost" disabled={isProcessing} type="submit" >{ isProcessing ? 'Запазване...' : 'Запази' }</button>
//                     <button className="w-[35%] btn btn-md btn-circle btn-ghost "onClick={()=>window.modal_1.close()} >Затвори</button>
//                 </div>
//             </form>
//         </>
//     );
// }
import React, { FC, useState } from "react";
import { ItemProps } from "./ItemProps";
import * as funcs from "./handleFunctions";
import { ModalHead, Tbody, Thead } from "./thead";

interface KontragentProps {
    handleSubmitVtoroNivo: ItemProps["handleSubmitVtoroNivo"];
    wrong: ItemProps["wrong"];
    isProcessing: ItemProps['isProcessing'];
    setData2: ItemProps["setData2"];
    isOpen: ItemProps['isOpen'];
    setOpen: ItemProps['setOpen'];
    val: ItemProps['val'];
    data2: ItemProps["data2"];
    results: ItemProps["results"];
    setProcessing: ItemProps['setProcessing'];
    setToasty: ItemProps['setToasty'];
    setVal: ItemProps["setVal"];
    setResults: ItemProps['setResults'];
    chosen: ItemProps["chosen"];
    setChosen: ItemProps['setChosen'];
    setWrong: ItemProps["setWrong"];

}

const Kontragent : FC<KontragentProps> = ({handleSubmitVtoroNivo, wrong, isProcessing, setData2, isOpen, setOpen, val, data2, results, setProcessing, setToasty,setVal, setResults, chosen, setChosen, setWrong}) => {
    const [deleteBtn, setDeleteBtn] = useState<boolean>(false);
    const catNames = Object.keys(results)[val] as keyof typeof results;
    const catValues = Object.values(results)[val] as any;
    const [editableIndex, setEditableIndex] = useState<number | null>(null);
    const [data, setData] = useState<any>();
    const [select, setSelect] = useState<any>(null);
    const [isAdd, setAdd] = useState<boolean>(false);
    const [isProcessing1, setProcessing1] = useState<boolean>(false);


    const onSave = async (idx: any) => {
        const props: any = {
          idx: idx,
          val: val,
          data: data,
          catNames: catNames,
          setEditableIndex: setEditableIndex,
          setData2: setData2,
        };
        await funcs.handleSave(props);
      };

    const onEdit = async (idx: any) => {
        const props : any = {
            setEditableIndex: setEditableIndex,
            idx: idx,
            setDeleteBtn: setDeleteBtn,
            catValues: catValues,
            setData: setData,
            setSelect: setSelect,
            select: select,
        };
        await funcs.handleEdit(props);
    }

    const onDelete = async (itemId: any, idx: any) => {
        console.log(`debig 1`, itemId, idx);
        const props : any = {
            itemId: itemId,
            idx: idx,
            setDeleteBtn: setDeleteBtn,
            catValues: catValues,
            setResults: setResults,
            catNames: catNames,
            val: val,
        };
        await funcs.handleDelete(props);
    }

    const onDeleteAll = async () => {
        const props : any = {
            setProcessing1: setProcessing1,
            setEditableIndex: setEditableIndex,
            setToasty: setToasty,
            setData2: setData2,
            catNames: catNames,
            setDeleteBtn: setDeleteBtn,
            deleteBtn: deleteBtn,
            val: val,
        };
        await funcs.handleDeleteAll(props);
    }

    const onPrint = async () => {
        const props : any = {
            setDeleteBtn: setDeleteBtn,
            val: val,
        };
        await funcs.handlePrint(props);
    }

    const DoubleClick = async (result : any) => {
        const props : any = {
            setDeleteBtn: setDeleteBtn,
            val: val,
            setChosen: setChosen,
            setResults: setResults,
            setVal: setVal,
            results: results,
        }
        await funcs.handleDoubleClick(result, props);
    }
    return (
        <>
            <ModalHead data2={data2} catValues={catValues} catNames={catNames} chosen={chosen} deleteBtn={deleteBtn} isProcessing={isProcessing} onPrint={onPrint} isProcessing1={isProcessing1} setDeleteBtn={setDeleteBtn} isAdd={isAdd} setAdd={setAdd} setWrong={setWrong} val={val} results={results} onDeleteAll={onDeleteAll} setVal={setVal} setResults={setResults} />
                <div className="overflow-x-auto max-w-screen" id={`printable-content/${val}`} >
                    { isProcessing ? <div className="my-8" ><span className="loading loading-spinner loading-2xl mr-3" />Зареждане...</div> :
                        <table className="table" >
                            <Thead catValues={catValues} />
                            <Tbody catValues={catValues} DoubleClick={DoubleClick} setData={setData} select={select} editableIndex={editableIndex} onSave={onSave} setEditableIndex={setEditableIndex} onEdit={onEdit} onDelete={onDelete} catNames={catNames}  data2={data2} />
                        </table> }
                </div>
                    {   isAdd ?  <form onSubmit={handleSubmitVtoroNivo as any} >
                        <div className="flex flex-row justify-start align-center gap-10 mb-5" >
                        <label className="label" htmlFor="name">
                            <span className="label-text" >Име</span>
                        </label>
                        <input type="text" name="name" required placeholder="метал" disabled={isProcessing} className={`input input-border  max-w-screen ${wrong[catNames].is ? 'input-error' : ''} `} 
                        onChange={(e) => setData2((prevData) => ({...prevData, [catNames] : {...prevData[catNames], text: e.target.value}}))} value={data2[catNames].text} />
                        </div>
                        { wrong[catNames].is === true && <><span className="font-medium" >Опа! </span>{wrong[catNames].txt}!</>}
                        <div className="flex flex-row max-w-screen mt-5">
                            <button className="w-[65%] btn btn-md btn-circle btn-ghost" disabled={isProcessing} type="submit" >{ isProcessing ? 'Запазване...' : 'Запази' }</button>
                            <button className="w-[35%] btn btn-md btn-circle btn-ghost "onClick={() => (window as any).modal_1.close() && (window as any).toasty.close() && setOpen((prevOpen: any) => !prevOpen) }>Затвори</button>
                        </div>
                    </form> : <div className="flex justify-end" ><button className="w-[35%] btn btn-md btn-circle btn-ghost justify-center ml-2 bottom-2 " onClick={() => (window as any).modal_1.close() && (window as any).toasty.close() && setOpen((prevOpen : any) => !prevOpen )} >Затвори</button></div> }
        </>
    );
}

export default Kontragent;