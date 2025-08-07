import { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfileSettings({ user }) {
  const [nickname, setNickname] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profileUrl, setProfileUrl] = useState("");

  const fetchProfile = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setNickname(data.nickname || "");
      setProfileUrl(data.profileUrl || "");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpload = async () => {
    if (!profilePic) return;
    const picRef = ref(storage, `profilePics/${user.uid}`);
    await uploadBytes(picRef, profilePic);
    const url = await getDownloadURL(picRef);

    await setDoc(doc(db, "users", user.uid), {
      nickname,
      profileUrl: url,
    });

    setProfileUrl(url);
    alert("Profile updated!");
  };

  return (
    <div>
      <h2>Profile Settings</h2>
      <div>
        {profileUrl && <img src={profileUrl} alt="Profile" width="100" />}
        <p><strong>Nickname:</strong> {nickname}</p>
      </div>
      <input
        type="text"
        placeholder="Enter Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setProfilePic(e.target.files[0])}
      />
      <button onClick={handleUpload}>Save Profile</button>
    </div>
  );
}