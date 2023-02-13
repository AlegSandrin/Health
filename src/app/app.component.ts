import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { AuthService } from './services/auth.service';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString} from 'firebase/storage';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem/dist/esm/definitions';
import { LoadingController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';


const IMAGE_DIR = 'stored-images';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  images: LocalFile[] = [];

  constructor(private router: Router, 
    public auth: AngularFireAuth, 
    private authService: AuthService,
    private platform: Platform,
    private loadingCtrl: LoadingController) {}

  usuario : any;
  uid : any;

  async ngOnInit(){

    this.loadFiles("verif dir");

    this.auth.onAuthStateChanged(async user => { // verifica se o usuário esta logado
      if (user) {
    this.router.navigateByUrl("/inicial");  // se estiver logado manda pra página inicial  
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    this.uid = user.uid;
    const db = getFirestore();
    const docRef = doc(db, "BDusuarios", uid);

    this.loadProfilePic(uid);

    try {
      const doc = await getDoc(docRef);
      this.usuario = doc.data();
    } catch (e) {
      console.log("Error getting cached document:", e);
    }
      }
      else{
        this.router.navigateByUrl("/home");
      }
    });

    }

  signOut(){
    this.authService.logout();
    }

   async selectImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    })
    if(image) {
      this.saveImage(image);
    }
    }

    async loadFiles(condition){
      this.images = [];

      Filesystem.readdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      }).then(async result => {

        if(condition == "load"){

        const loading = await this.loadingCtrl.create({
          message: 'Carregando dados...',
        });
        await loading.present();
        this.loadFileData(result.files);
        loading.dismiss();

        }

      }, async error => {
        await Filesystem.mkdir({
          directory: Directory.Data,
          path: IMAGE_DIR
        });
      }).then(_ => {})
    }

    async loadFileData(fileNames){
        let file = fileNames[0].name;
        const filePath = `${IMAGE_DIR}/${file}`;

        const readFile = await Filesystem.readFile({
          directory: Directory.Data,
          path: filePath
        });

        this.images.push({
          name: file,
          path: filePath,
          data: `data:image/jpeg;base64,${readFile.data}`
        })
        const data = `data:image/jpeg;base64,${readFile.data}`;
        this.uploadImage(data);
    }

    async saveImage(photo: Photo){
      const base64Data = await this.readAsBase64(photo);
      const fileName = 'ProfilePicture.jpeg';
      const savedFile = await Filesystem.writeFile({
        directory: Directory.Data,
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data
      });
      this.loadFiles("load");
    }

    async readAsBase64(photo: Photo) {
      if (this.platform.is('hybrid')) {
        const file = await Filesystem.readFile({
          path: photo.path
        });
    
        return file.data;
      }
      else {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        return await this.convertBlobToBase64(blob) as string;
      }
    }

    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

     uploadImage(data){
       const storage = getStorage();
       const link = environment.firebase.storageBucket;
       const storageRef = ref(storage, `gs://${link}/IMGusuarios/${this.uid}`);

       uploadString(storageRef, data, 'data_url').then((snapshot) => {
        this.loadProfilePic(this.uid);
        // location.reload();
      });
     }

     loadProfilePic(uid){
      const storage = getStorage();
      const link = environment.firebase.storageBucket;
      getDownloadURL(ref(storage, `gs://${link}/IMGusuarios/${uid}`))
      .then((url) => {
        const img = document.getElementById('profilePic');
        img.setAttribute('src', url);
      })
      .catch((error) => {
        console.log('error: ',error);
      });
     }

}
