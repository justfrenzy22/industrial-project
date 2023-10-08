const Toasty = ({text, setToasty, toasty}) => {
    return (
        <>
            <dialog id="toast" className="modal-box" >
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 uppercase" onClick={() => window.toast.close()}>x</button>
                <form>
                    <h3 className="font-bold text-lg mb-3 " >Здравейте</h3>
                    <p className="py-5" >{toasty.text}</p>
                </form>
            </dialog>
        </>
    );
}

export default Toasty;