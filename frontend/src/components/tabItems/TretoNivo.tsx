// const TretoNivo = ({handleSubmitVtoroNivo, isProcessing, setData2, wrong,  data2, results, }) => {
//     return (
//         <>
//             <form onSubmit={handleSubmitVtoroNivo} >
//                 <h3 className="font-bold text-lg mb-5 uppercase" >трето ниво</h3>
//                 <select className="select select-ghost w-full max-w-xs mb-8" value={data2.treto.id ? data2.treto.id : ''} onChange={(e) => {
//                     const name = e.target.options[e.target.selectedIndex].text; const id = e.target.value;
//                     setData2((prevData) => ({ ...prevData, treto: { ...prevData.treto, name: name, id: id, },}))}}>

//                 <option disabled defaultValue >Второ ниво суровини ({results.vtoro && results.vtoro.length})</option>
//                     { results.vtoro && results.vtoro.map((result) =>
//                     <option value={ result._id ? result._id : '' } key={result._id} >{result.name}</option>) }
//                 </select>
//                 { data2.treto.name && <div> Избрана суровина <a className="link link-hover link-accent">{data2.treto.name}</a> </div> }
//                 <input type="text" required placeholder="второ ниво суровина" disabled={isProcessing} className={`input input-border w-full max-w-screen my-5 ${wrong.treto.is ? 'input-error' : ''} `} 
//                   onChange={(e) => setData2((prevData) => ({ ...prevData, treto: { ...prevData.treto, text: e.target.value }}))} />
//                 { wrong.treto.is && <><span className="font-medium" >Опа! </span>{wrong.treto.txt}!</>}
//                 <div className="flex flex-row max-w-screen mt-5">
//                     <button className="w-[65%] btn btn-md btn-circle btn-ghost" disabled={isProcessing} type="submit" >{ isProcessing ? 'Запазване...' : 'Запази' }</button>
//                     <button className="w-[35%] btn btn-md btn-circle btn-ghost "onClick={()=>window.modal_1.close()} >Затвори</button>
//                 </div>
//             </form>
//         </>
//     )
// }

// export default TretoNivo;
import React, {FC, useEffect, useState} from "react";
import { ItemProps } from './ItemProps';
import * as funcs from "./handleFunctions";
import { ModalHead, Tbody, Thead } from "./thead";

interface TretoNivoProps {
    handleSubmitVtoroNivo: ItemProps['handleSubmitVtoroNivo'];
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


const TretoNivo:FC<TretoNivoProps> = ({handleSubmitVtoroNivo, wrong, isProcessing, setData2, isOpen, setOpen, val, data2, results, setProcessing, setToasty,setVal, setResults, chosen, setChosen, setWrong}) => {
    const [deleteBtn, setDeleteBtn] = useState<boolean>(false);
    const catNames = Object.keys(results)[val] as any;
    const catValues = Object.values(results)[val] as any;
    const [editableIndex, setEditableIndex] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [select, setSelect] = useState<any>(null);
    const [isAdd, setAdd] = useState<boolean>(false);
    const [isProcessing1, setProcessing1] = useState<boolean>(false);
    console.log(`izvikvaneeee`);
    
    useEffect(() => {
        const previousCatName : any = val > 0 && Object.values(chosen)[val-1];
        console.log(`previousCatName treto: `, previousCatName);
        setData2((prevData: any) => ({...prevData, [catNames] : { ...prevData[catNames], id: previousCatName.id, name: previousCatName.name } }));
    }, [])
    
    const onSave = async (idx: any) => {
        const props : any = {
            idx: idx,
            val: val,
            data: data,
            catNames: catNames,
            setEditableIndex: setEditableIndex,
            setData2: setData2,
        }
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
    };

    const onDelete = async (itemId: any, idx: any) => {
        const props: any = {
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
        }
        await funcs.handleDeleteAll(props);
    }

    const onPrint = () => {
        const props : any = {
            setDeleteBtn: setDeleteBtn,
            val: val,
        };
        funcs.handlePrint(props);
    }

    const DoubleClick = async (result: any) => {
        const props : any = {
            setDeleteBtn: setDeleteBtn,
            val: val,
            setChosen: setChosen,
            setResults: setResults,
            setVal: setVal,
            results: results,
        };
        await funcs.handleDoubleClick(result, props);
    };

    return (
        <>
        {
                console.log(`mqu`, chosen)
            }
            <ModalHead data2={data2} catValues={catValues} catNames={catNames} chosen={chosen} deleteBtn={deleteBtn} isProcessing={isProcessing} onPrint={onPrint} isProcessing1={isProcessing1} setDeleteBtn={setDeleteBtn} isAdd={isAdd} setAdd={setAdd} setWrong={setWrong} val={val} results={results} onDeleteAll={onDeleteAll} setVal={setVal} setResults={setResults} />
            <div className="overflow-x-auto max-w-screen" id={`printable-content/${val}`} >
                {isProcessing ? <div className="my-8"><span className="loading loading-spinner loading-2xl mr-3">Зареждане...</span></div> : 
                <table className="table" >
                    <Thead catValues={catValues} />
                    <Tbody catValues={catValues} DoubleClick={DoubleClick} setData={setData} select={select} editableIndex={editableIndex} onSave={onSave} setEditableIndex={setEditableIndex} onEdit={onEdit} onDelete={onDelete} catNames={catNames} data2={data2} />
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
    )
}

export default TretoNivo;
