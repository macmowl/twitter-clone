import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon } from "@heroicons/react/outline";
import { useRef, useState } from "react";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { db, storage } from "../firebase";

const Input = () => {
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef(null);

    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            // id: session.user.uid,
            // username: session.user.name,
            // userImg: session.user.image,
            // tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp(),
        });

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(async () => {
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(db, "posts", docRef.id), {
                    image: downloadURL,
                });
            });
        }

        setLoading(false);
        setInput("");
        setSelectedFile(null);
        setShowEmojis(false);
    }

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        }
    }

    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach( el => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setInput(input + emoji);
    }


    return (
        <div className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll ${loading && "opacity-60"}`}>
            <img src="https://lh3.googleusercontent.com/a/AATXAJwCsuneWAkKlHwMPxOmLNjFACEvbtN8QPwbUsZ-=s96-c" alt="" className="w-11 h-11 rounded-full cursor-pointer"/>
            <div className="w-full divide-y divide-gray-700">
                <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                    <textarea
                        value={input}
                        placeholder="Type a word"
                        rows="2"
                        onChange={(e) => setInput(e.target.value)}
                        className="bg-transparent outline-none text-[#D9D9D9] text-lg placeholder:gray-500 tracking-wide w-full min-h-[50px]"
                    />

                    {selectedFile && (
                        <div className="relative">
                            <div
                                onClick={() => setSelectedFile(null)}
                                className="absolute w-8 h-8 bg-[#15181C] hover:bg-[#272C26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                            >
                                <XIcon className="text-white h-5" />
                            </div>
                            <img src={selectedFile} alt="" className="rounded-2xl max-h-80 object-contain" />
                        </div>
                    )}
                </div>
                {!loading && (
                    <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center">
                            <div className="icon" onClick={() => filePickerRef.current.click()}>
                                <PhotographIcon className="h-[22px] text-[#1D9BF0]" />
                                <input type="file" hidden onChange={addImageToPost} ref={filePickerRef} hidden/>
                            </div>
                            <div className="icon rotate-90">
                                <ChartBarIcon className="text-[#1D9BF0] h-[22px]" />
                            </div>
                            <div className="icon" onClick={() => setShowEmojis(!showEmojis || window.click)}>
                                <EmojiHappyIcon className="text-[#1D9BF0] h-[22px]" />
                            </div>
                            <div className="icon">
                                <CalendarIcon className="text-[#1D9BF0] h-[22px]" />
                            </div>

                            {showEmojis && (
                                <Picker 
                                    onSelect={addEmoji}
                                    style={{
                                        position: "absolute",
                                        marginTop: "465px",
                                        marginLeft: -40,
                                        maxWidth: "320px",
                                        borderRadius: "10px",
                                    }}
                                    theme="dark"
                                />
                            )}
                        </div>
                        <button
                            className="bg-[#1D9BF0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1A8CD8] disabled:hover:bg-[#1D9BF0] disabled:opacity-50 disabled:cursor-default"
                            disabled={!input.trim() && !selectedFile}
                            onClick={sendPost}
                        >Tweet</button>
                    </div>
                )}
                
            </div>
        </div>
    )
}

export default Input
