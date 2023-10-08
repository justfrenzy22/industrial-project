import React, {FC, useEffect, useState} from "react";
import { ItemProps } from './ItemProps';
import * as funcs from "./handleFunctions";
import { ModalHead, Tbody, Thead } from "./thead";

interface ProductProps {
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


const Product:FC<ProductProps> = ({handleSubmitVtoroNivo, wrong, isProcessing, setData2, isOpen, setOpen, val, data2, results, setProcessing, setToasty,setVal, setResults, chosen, setChosen, setWrong}) => {
    const [deleteBtn, setDeleteBtn] = useState<boolean>(false);
    const catNames = Object.keys(results)[val] as any;
    const catValues = Object.values(results)[val] as any;
    const [supplierMap, setSupplierMap] = useState<any>();
    const [editableIndex, setEditableIndex] = useState<number | null>(null);
    const [data, setData] = useState<any>();
    const [select, setSelect] = useState<any | object>(null);
    const [isAdd, setAdd] = useState<boolean>(false);
    const [isProcessing1, setProcessing1] = useState<boolean>(false);

    useEffect(() => {
        const previousCatName : any = val > 0 && Object.values(chosen)[2];
        console.log(`previousCatName 12`, previousCatName, results);
        setData2((prevData: any) => ({...prevData, [catNames] : { ...prevData[catNames], [Object.keys(results)[2]] : { ...prevData[Object.keys(results)[2]], name: previousCatName.name, id: previousCatName.id }  } }));
    }, []);

    useEffect( () => {
        // setSupplierMap()
        const suppliersFunc = async () => {
            const response = await fetch(`http://192.168.0.102:8000/suppliers`).then((res) => res.json()).catch((err) => console.error(err));
            setSupplierMap(response.suppliers);
            console.log(`debugr tututu`, response);
            console.log(`supplierMap`, supplierMap);
        }
        suppliersFunc();
    },[isAdd]);

    const ProductMap = [
        {name: 'name', placeholder: 'име', value: 'Име на продукта', },
        { name: 'measure', placeholder: 'мащаб', value : 'Мащаб на продукта' },
        { name: 'density', placeholder: 'плътност', value: 'Плътност на продукта' },
        { name: 'size', placeholder: 'размер', value: 'Размер на продукта' },
        { name: 'weight', placeholder: 'Тежест', value: 'Тежест на продукта' },
        { name: 'description', placeholder: 'описание...', value: 'Описание на продукта' },
        { name: 'another', placeholder: 'информация...', value: 'Друга информация' },
        { name: 'code', placeholder: 'код', value: 'Код' },
        { name: 'package', placeholder: 'пакет', value: 'Пакет' },
        { name: 'cost', placeholder: 'цена', value: 'Цена' },
    ];

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
            <ModalHead data2={data2} catValues={catValues} catNames={catNames} chosen={chosen} deleteBtn={deleteBtn} isProcessing={isProcessing} onPrint={onPrint} isProcessing1={isProcessing1} setDeleteBtn={setDeleteBtn} isAdd={isAdd} setAdd={setAdd} setWrong={setWrong} val={val} results={results} onDeleteAll={onDeleteAll} setVal={setVal} setResults={setResults} />
 
            <div className="overflow-x-auto max-w-screen" id={`printable-content/${val}`} >
                {isProcessing ? <div className="my-8"><span className="loading loading-spinner loading-2xl mr-3">Зареждане...</span></div> : 
                <table className="table" >
                    <Thead catValues={catValues} />
                    <Tbody catValues={catValues} DoubleClick={DoubleClick} setData={setData} select={select} editableIndex={editableIndex} onSave={onSave} setEditableIndex={setEditableIndex} onEdit={onEdit} onDelete={onDelete} catNames={catNames} data2={data2} />
                </table> }
            </div>
            { isAdd ?  <form onSubmit={handleSubmitVtoroNivo as any} className="mt-10">
                         { wrong[catNames].is === true && <><span className="font-medium" >Опа! </span>{wrong[catNames].txt}!</>}
                        <div className="flex flex-row justify-start align-center gap-10 mb-5" >
                            <label htmlFor="name" className="label"><span className="label-text" >Доставчик име: </span></label>
                            <select defaultValue={'default'} className="select select-bordered w-full max-w-xs" onChange={(e) => setData2((prevData) => ({...prevData, [catNames] : {...prevData[catNames], supplier: {...prevData[catNames].supplier, id: e.target.value} }})) } >
                            <option disabled value={'default'}>Доставчици</option>
                            { supplierMap && supplierMap.map((result : any, idx : any) => 
                                <option key={idx} value={result.id} >{result.name}</option>)}
                            </select>
                        </div>
                         { ProductMap.map((result, idx) => 
                         <div key={idx} className="flex flex-row justify-start align-center gap-10 mb-5" >
                             <label className="label" htmlFor={result.name} >
                                 <span className="label-text" >{result.value}</span>
                             </label>
                             <input required type="text" name={result.name} placeholder={result.placeholder} disabled={isProcessing} className={`input input-border max-w-screen ${wrong[catNames].is ? 'input-error' : ''}`} 
                              onChange={(e) => setData2((prevData) => ({...prevData, [catNames] : {...prevData[catNames], [result.name] : e.target.value}}))} />
                         </div>)}
                         <div className="flex flex-row max-w-screen mt-5">
                             <button className="w-[65%] btn btn-md btn-circle btn-ghost" disabled={isProcessing} type="submit" >{ isProcessing ? 'Запазване...' : 'Запази' }</button>
                             <button className="w-[35%] btn btn-md btn-circle btn-ghost "onClick={() => (window as any).modal_1.close() && (window as any).toasty.close() && setOpen((prevOpen: any) => !prevOpen) }>Затвори</button>
                         </div>
                     </form> : <div className="flex justify-end" ><button className="w-[35%] btn btn-md btn-circle btn-ghost justify-center ml-2 bottom-2 " onClick={() => (window as any).modal_1.close() && (window as any).toasty.close() && setOpen((prevOpen : any) => !prevOpen )} >Затвори</button></div> }

        </>
    )
}

export default Product;

// const Product = () => {
//     return (
//         <div>
//             Enter Product Something
//         </div>
//     );
// }

// export default Product;

// const Product = ({handleSubmitVtoroNivo, wrong, isProcessing, setData2, isOpen, setOpen, val, data2, results}) => {
//     const ProductMap = [
//         {name: 'name', placeholder: 'име на продукта', value: 'Име на продукта', },
//         { name: 'measure', placeholder: 'Мащаб на продукта', value : 'Мащаб' },
//         { name: 'density', placeholder: 'Плътност на продукта', value: 'Плътност' },
//         { name: 'size', placeholder: 'Размер на продукта', value: 'Размер' },
//         { name: 'weight', placeholder: 'Тежест на продукта', value: 'Тежест' },
//         { name: 'description', placeholder: 'описание...', value: 'Описание' },
//         { name: 'another', placeholder: 'информация...', value: 'Друга информация' },
//         { name: 'code', placeholder: 'код', value: 'Код' },
//         { name: 'package', placeholder: 'пакет', value: 'Пакет' },
//         { name: 'cost', placeholder: 'цена', value: 'Цена' },
//     ];
//     return (
//         <>
//             <form onSubmit={handleSubmitVtoroNivo} >
//                 <h3 className="font-bold text-lg mb-5 uppercase" >Продукти</h3>

//                 <div className="flex flex-col md:flex-row pb-5 justify-around" >
//                     <div>
//                         <select className="select select-ghost w-full max-w-xs mb-8" value={data2.product.treto.id ? data2.product.treto.id : ''} onChange={(e) => {
//                             const name = e.target.options[e.target.selectedIndex].text; const id = e.target.value;
//                             setData2((prevData) => ({ ...prevData, product: { ...prevData.product, treto: {...prevData.product.treto, name: name, id: id} },}))}}>

//                         <option disabled defaultValue >Трето ниво суровини ({results.treto && results.treto.length})</option>
//                             { results.treto.map((result) =>
//                             <option value={ result._id ? result._id : '' } key={result._id} >{result.name}</option>) }
//                         </select>
//                         { data2.product.treto.name && <div> Избрана трето ниво суровина <a className="link link-hover link-accent">{data2.product.treto.name}</a> </div> }
//                     </div>
//                     <div>
//                         <select className="select select-ghost w-full max-w-xs mb-8" value={data2.product.supplier.id ? data2.product.supplier.id : ''} onChange={(e) => {
//                             const name = e.target.options[e.target.selectedIndex].text; const id = e.target.value;
//                             setData2((prevData) => ({ ...prevData, product: { ...prevData.product, supplier: {...prevData.product.supplier, name: name, id: id} },}))}}>

//                         <option disabled defaultValue >Доставчици ({results.supplier && results.supplier.length})</option>
//                             { results.supplier.map((result) =>
//                             <option value={ result._id ? result._id : '' } key={result._id} >{result.name}</option>) }
//                         </select>
//                         { data2.product.supplier.name && <div> Избран доставчик <a className="link link-hover link-accent">{data2.product.supplier.name}</a> </div> }
//                     </div>

//                 </div>


//                 { wrong.product.is && <><span className="font-medium" >Опа! </span>{wrong.product.txt}!</>}
//                 { ProductMap.map((result, idx) => <div className="my-5" >
//                     <label key={idx} htmlFor={result.name} >{result.value}</label>
//                     <input required type="text" name={result.name} placeholder={result.placeholder} disabled={isProcessing} 
//                       className={`input input-border w-full max-w-screen mt-2  ${wrong.product.is ? 'input-error' : ''}`} 
//                       onChange={(e) => setData2((prevData) => ({...prevData, product: {...prevData.product, [result.name] : e.target.value }})) }
//                     />
//                 </div> )}
//                 <div className="flex flex-row max-w-screen mt-5">
//                     <button className="w-[65%] btn btn-md btn-circle btn-ghost" disabled={isProcessing} type="submit" >{ isProcessing ? 'Запазване...' : 'Запази' }</button>
//                     <button className="w-[35%] btn btn-md btn-circle btn-ghost "onClick={()=>window.modal_1.close()} >Затвори</button>
//                 </div>
//             </form>
//         </>
//     );
// }

// export default Product;