import React, { FC } from "react";
import { ItemProps } from "./ItemProps"

interface TheadProps {
    catValues: ItemProps['catValues'];
}

export const Thead : FC<TheadProps> = ({catValues})  : JSX.Element => {

    // console.log(`catValues`, catValues[0] && catValues[0])

    return (
        <thead>

           {/* { catValues && catValues[0] && Object.keys(catValues[0]).map((key : string, idx : number) => <th key={idx} >{key === 'name' ? 'Име' : key) } */}
            <tr>
                <th>Номер</th>
                { catValues && catValues.length > 0 && Object.keys(catValues[0]).map((key : any, idx : number) => {
                    if ( key.includes('Id') === false && key.includes('id') === false) {
                        return <th key={idx} >{key === 'name' ? 'Име' : key}</th> }
                    // } else if ( key !== null && key.name !== null ) {
                    //     console.log(`key`, key)
                    //     return <th key={idx} >{key.name}</th>
                    // }
                    return null
                })}
                <th className="no-print" >Промяна / Изтриване</th>
            </tr>
        </thead>
    )
}

interface TbodyProps {
    catValues: ItemProps['catValues'];
    DoubleClick: (e : any) => void;
    setData: React.Dispatch<React.SetStateAction<ItemProps['setData']>>;
    select : ItemProps['select'];
    editableIndex : ItemProps['editableIndex'];
    onSave: (idx : number) => void;
    setEditableIndex: React.Dispatch<React.SetStateAction<number | null>>;
    onEdit: (idx: number | null) => void;
    onDelete: (id : string, idx : number) => void;
    catNames: ItemProps['catNames'];
    data2: ItemProps['data2'];

}

export const Tbody = (props: TbodyProps) : JSX.Element => {
    const { catValues, DoubleClick, setData, select, editableIndex, onSave, setEditableIndex, onEdit, onDelete, catNames, data2 } = props;
    console.log(`catValues TBODY`, catNames, catValues);
    return (
        <tbody>
            {/* { catValues && catValues.length > 0 ? catValues.map((result : any, idx: number)=> ) } */}
      { catValues && catValues.length > 0 ? catValues.map((result : any, idx : number) => (
          <tr key={result.id} className="cursor-pointer" onDoubleClick={() => DoubleClick(result)} >
                <td><div className="flex items-center space-x-3" >№ {idx + 1}</div></td>
                { Object.keys(result).map((e, indx) => {
                    if ( e.includes('Id') === false && e.includes('id') === false ) return (
                        <td key={indx} >
                            <div className="flex items-center space-x-3" >
                                { editableIndex === idx ? ( <>
                                    {typeof result[e] === 'object' && result[e] !== null && result[e].name !== null ? (
                                        <th>{result[e].name}</th>

                                    ) : (
                                        <div
                                          contentEditable
                                          onInput={(event) => {
                                            const target = event.target as HTMLDivElement;
                                            setData((prevData: any) => ({...prevData, [e]: target.textContent || ''}));
                                          }}
                                         >{result[e]}</div>
                                    )}
                                </> ) : (
                                    <div>
                                        { typeof result[e] === 'object' && result[e] !== null && result[e].name !== null ? result[e].name : result[e] }
                                    </div>
                                )}
                            </div>
                        </td>
                    )
                    return null;
                })}
                <th className="no-print" >
                    { editableIndex === idx  ? (
                        <div>
                            <button className="btn btn-ghost btn-xs" onClick={() => onSave(idx)} >Save</button>
                            <button className="btn btn-ghost btn-xs" onClick={() => setEditableIndex(null)} >Cancel</button>
                        </div>
                    ) : (
                    <div>
                        <button className="btn btn-ghost btn-xs" onClick={() => onEdit(idx)} >Edit</button>
                        <button className="btn btn-ghost btn-xs" onClick={() => onDelete(result.id, idx)} >Delete</button>
                    </div>)}
                </th>
            </tr>
        )) : ( <tr><td> Няма открити артикули от { catNames === 'surovini' ? 'суровини' : catNames === 'supplier' ? data2[catNames].kontragent : catNames === 'product' ? data2[catNames].treto.name :  data2[catNames].name  } </td></tr> )} 
    </tbody>
    )
}


interface ModHeadProps {
    catValues: ItemProps['catValues'];
    catNames: ItemProps['catNames'];
    chosen: ItemProps['chosen'];
    deleteBtn: ItemProps['deleteBtn'];
    isProcessing: ItemProps['isProcessing'];
    onPrint: ItemProps['onPrint'];
    isProcessing1: ItemProps['isProcessing1'];
    setDeleteBtn: ItemProps['setDeleteBtn'];
    isAdd: ItemProps['isAdd'];
    setAdd: ItemProps['setAdd'];
    setWrong: ItemProps['setWrong'];
    val: ItemProps['val'];
    results: ItemProps['results'];
    onDeleteAll: ItemProps['onDeleteAll'];
    setVal: ItemProps['setVal'];
    data2: ItemProps['data2'];
    setResults: ItemProps['setResults'];
}

export const ModalHead = (props: ModHeadProps) : JSX.Element => {
    const { catValues, catNames, chosen, deleteBtn, isProcessing, onPrint, isProcessing1, setDeleteBtn, isAdd, setAdd, setWrong, val, results, onDeleteAll, setVal, data2, setResults } = props;
    return (
        <>
            <h3 className="font-bold text-lg mb-5 uppercase">
                {val === 0 ? (
                    <span>суровини { catValues ? `(${catValues.length})` : '(0)' }</span>) :
                val === 3 ? ( <span>контрагенти { catValues ? `(${catValues.length})` : '(0)' }</span> ) :
                ( <span className="cursor-pointer" onClick={() => {
                            if (val === 5) { setVal(2); } else { setVal(val - 1); setResults((prevResults: any) => ({ ...prevResults, [catNames]: null, })); }}}>

                            {typeof chosen[Object.keys(results)[val - 1]] === 'object' &&
                            chosen[Object.keys(results)[val - 1]] !== null &&
                            [Object.values(chosen)[val - 1][0]]}
                            {catValues ? (` ${
                                catNames === 'supplier' ? `${data2[catNames].kontragent}` :
                                catNames === 'product' ? `${data2[catNames].treto.name}` :
                                data2[catNames].name
                            } (${catValues.length})`) :
                            ` ${
                                catNames === 'supplier' ? `${data2[catNames].kontragent}` :
                                catNames === 'product' ? `${data2[catNames].treto.name}` :
                                data2[catNames].name
                            } (0) `}
                        </span>
                        )}
                    {/* {console.log(`data2[catName]`, data2[catNames])} */}
                </h3>
                <div className="flex flex-row justify-center align-center" >
                    <p className=" text-xl" > Статус : { isAdd ?  <span className="text-green-700 font-bold">ДОБАВЯНЕ</span> : <span className="text-red-700 font-bold" >ИЗКЛЮЧЕН</span> } </p>
                </div>
                <div className="flex flex-row mt-5 mb-5" >
                    {/* бутон да изтриване на суровини */ }
                    {/* { deleteBtn ? */}
                        {/* <button className={`btn btn-sm rounded-full ${isProcessing1 ? 'loading loading-spinner' : ''}`} onClick={() => onDeleteAll()} >{isProcessing1 ? 'Loading...' : 'Изтрий всички'}</button> : */}
                        {/* <button className="btn btn-sm rounded-full btn-circle" onClick={() => setDeleteBtn((prevDel : boolean) => !prevDel)} >x</button> } */}
                    {/* бутон за принтиране на суровини */}
                    { isProcessing ? <div className='ml-8 btn btn-sm rounded-full' ><span className='loading loading-dots loading-xs' /></div> : <button className='ml-3 btn btn-sm rounded-full ' onClick={() => onPrint()} >Принтирай</button> }
                    { !isAdd ? <button className='ml-3 btn btn-sm rounded-full' onClick={() => setAdd((prevAdd : boolean) => !prevAdd)} >Добави</button> : <button className='ml-3 btn btn-sm rounded-full' onClick={() => {setAdd((prevAdd : boolean) => !prevAdd); setWrong((prevWrong : any) => ({...prevWrong, surovini: { ...prevWrong.surovini, is: false, txt: '' }}))}} >Откажи добавянето</button> }
                </div>
        </>
    )
}