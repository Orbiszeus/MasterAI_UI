  <template>
    
    
    <div v-if="showOrganizationInput" class="split-screen organization-selection-container">
    
      <div class="organization-section-header">Investments</div>
      <div class="organization-input">
            <input type="text" v-model="organizationName" placeholder="enter organization.">
            <button @click="sendOrganizationName">OK</button>
          </div>
    </div>
    
    <div v-else-if="countrySelection" class="split-screen organization-selection-container">
    <div class="organization-section-header">Investments</div>
    
    <!-- Dropdown menu for selecting countries -->
      <div class="country-selection-container">
        <select v-model="selectedCountry">
        <option value="" disabled>Select country</option>
        <option value="Singapore">Singapore</option>
        <option value="Vietnam">Vietnam</option>
        <option value="Indonesia">Indonesia</option>
      </select>
      <button @click="sendCountry">OK</button>
    </div>
  </div> 

  <div v-else="leftMainScreen" class="split-screen organization-selection-container">
    <div class="organization-section-header">Investments</div>
      <div class="investment-information">
        
        <div class="organization-name">Organization: &nbsp&nbsp{{ organizationName }}</div>
        <div class="country">Country: &nbsp&nbsp{{ selectedCountry }}</div>
        <div class="fileNames">Recent Files: <br><br>
          <div v-for="(name, index) in fileNames" :key="index">
            <input type="checkbox" :id="name" @change="selectFileName(name, $event)">
    <label :for="name"> &nbsp{{ name }}</label>
    </div>
  </div>
      </div>
  </div>  
  

    <div class="split-screen chatbot-container">
      <div class="chatbot-header-container">
        <div class="chatbot-header">Chatbot</div>
        
      </div>
      <div class="chatbot-body-container">
        <div class="col-3">
        <div class="snippet" data-title="dot-overtaking"  v-if="isLoading">
          <div class="stage filter-contrast">
            <div class="dot-overtaking"></div>
          </div>
        </div>
      </div>
        <div class="chatbot-body" ref="chatbotBody">
          
          <div class="messages" ref="messages">
            <div v-for="(message, index) in messages" :key="index">
              <div v-if="message.isBot" class="bot-message">{{ message.text }} </div>
              <div v-else class="user-message">{{ message.text }}</div>
              </div>
            </div>
            <div class="scroll-bottom-button" @click="scrollBottom">
              <i class="fas fa-arrow-circle-down"></i>
            </div>
            
        </div>
        
        <div class="input-container">
          
          <div class="input">
            <input v-model="currentMessage" @keyup.enter="sendMessage" placeholder="Type a message...">
            <button class = "send-button" @click="sendMessage">Send</button>
            <button class="file-btn" @click="onPickFile">Select File</button>
        <button class="upload-btn" @click="uploadFile" :disabled="!selectedFile">Upload File</button>
  <input
    type="file"
    style="display: none"
    ref="fileInput"
    accept=".pdf, .txt, .csv, .docx, .pptx, .xlsx"
    @change="onFilePicked"
    multiple/>

            </div>
            
          </div>
        </div>
      </div>
      
  </template>

  <script>
  import ClipboardJS from 'clipboard';
  import axios from 'axios';
  import ToastPlugin from 'vue-toast-notification';
  import 'vue-toast-notification/dist/theme-bootstrap.css';
  import { getTransitionRawChildren } from 'vue';
  
  

  export default {
   
    data() {
      return {
        messages: [],
        currentMessage: '',
        selectedFile : null,
        uniqueId: '',
        uniqueIdList : [],
        dateTime : [],
        loading : false,
        showOrganizationInput: true,
        countrySelection : true,
        leftMainScreen : true,
        organizationName: '',
        selectedCountry: '',
        showThirdScreen: '',
        fileName : '',
        autoSummary : '',
        fileNames : [],
        in_session_unique_ids : [],
        isLoading: false,
        clipboardSnippets: null,
        selectedFileName : null,
        typingText: ''
      }
    },
    created() {
      setTimeout(() => {
      this.clearCache();
    },86000000);
    // Check if `uniqueId` exists in `localStorage` and set it in your data on page refresh
    if (this.isPageRefresh()) {
      this.uniqueId = localStorage.getItem('uniqueId') || '';
      const uniqueIdList = localStorage.getItem('uniqueIdList');
      this.uniqueIdList = uniqueIdList ? JSON.parse(uniqueIdList) : [];
      this.fileNames = JSON.parse(localStorage.getItem('fileNames')) || [];

    }
    
  },
  mounted() {
    // Your clipboard code here
    new ClipboardJS('.snippet', {
      text: trigger => trigger.getAttribute('data-title')
    });
  },
  
    methods: {
      isPageRefresh() {
      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length > 0) {
        // Check if the type of the most recent navigation entry is a page reload
        return navigationEntries[0].type === 'reload';
      }
      return false; // No navigation entries found
    },
      onPickFile () {
    this.$refs.fileInput.click()
    
  },
  
  onFilePicked (event) {
    this.selectedFile = event.target.files[0];
    console.log("file selected now is: " + this.selectedFile.name)
    const fileReader = new FileReader()
    fileReader.addEventListener('load', () => {
      this.imageUrl = fileReader.result
    })
    let instance = this.$toast.open({
      message: 'Your file(s) is uploaded, please press Upload File!',
      type: 'success',
      duration: 5500, // Notification will disappear after 4000ms
      position : 'top-right'
    });

    // Dismiss the toast notification after 4 seconds
    setTimeout(() => {
      instance.dismiss();
    }, 5500);
  },
  sendOrganizationName() {
    // Add logic to handle organization name input
    // For example, you can update the state and show organization details
    this.showOrganizationInput = false; // Set to false to hide the input
    // Perform any other actions you need with the organization name
    this.organizationName = this.organizationName.trim();
    console.log('Organization Name:', this.organizationName);
    return this.organizationName;
  },
  sendCountry() {
      console.log(this.selectedCountry)
      this.countrySelection = false;
      this.selectedCountry = this.selectedCountry.trim();
      return this.selectedCountry;
    },
    async sendFileNames(file) {
      console.log(file.name)
      this.fileName = this.file.name.trim();
      return this.fileName;
    },
  scrollBottom() {
  const chatbotBody = this.$refs.chatbotBody;
  chatbotBody.scrollTop = chatbotBody.scrollHeight - chatbotBody.clientHeight;
},
  async uploadFile() {
    this.isLoading = true;
    this.clipboardSnippets = new ClipboardJS('.snippet', {
      text: trigger => trigger.getAttribute('data-title')
    });
    console.log("upload file method called for: " + this.selectedFile.name)
    const files = this.$refs.fileInput.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
        formData.append('file_extension_list', files[i].name.split('.').pop()); // add file extension
        this.fileNames.push(files[i].name);
        localStorage.setItem('fileNames', JSON.stringify(this.fileNames));
    }
     
    const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/upload_pdf',
            crossDomain : true,
            headers: {
              accept: 'multipart/form-data',
              'Content-Type': 'multipart/form-data'
            },
            data:formData
          };
          axios
            .request(config)
            .then((response) => {
              this.isLoading = false;
              this.clipboardSnippets = null; // Remove the clipboardSnippets instance
              //console.log(JSON.stringify(response.data.text));
              console.log(response.data.uniqueId);
              this.uniqueId = response.data.uniqueId;
              localStorage.setItem('uniqueId', this.uniqueId);
              this.uniqueIdList.push({ fileName: this.selectedFile.name, uniqueId: response.data.uniqueId });
              localStorage.setItem('uniqueIdList', JSON.stringify(this.uniqueIdList));
              console.log(localStorage)
              this.uniqueIdList.forEach(item => {
  console.log(item.fileName); // Access the fileName
  console.log(item.uniqueId); // Access the uniqueId
});
              this.autoSummary = response.data.autoSummary;
              console.log("auto summary:" +this.autoSummary)
              this.messages.push({
              text: this.autoSummary.trim(),
              isBot: true
              });
              this.currentMessage = "";
              this.$nextTick(() => {
                this.scrollBottom();
              });
            })
            .catch((error) => {
              this.isLoading = false;
              this.clipboardSnippets = null;
              console.log('errorType', typeof error);
              console.log(error);
              console.log(this.selectedFile.name)
            });
    this.file = this.selectedFile
    console.log(this.file.name)
    this.dateTime = this.file.lastModifiedDate.toString().split(' ')
    console.log(this.dateTime.splice(0,4).join(' '))
    console.log("file:  " + this.file)
    this.postOrganizationName(this.organizationName);
    this.postCountry(this.selectedCountry);
    this.fileNames.forEach(name => {
    const checkbox = document.getElementById(name);
    if (checkbox) {
      checkbox.checked = false;
    }
  });
  // Set the selected file as the only checked one
  this.selectedFileName = this.selectedFile.name;
  const selectedCheckbox = document.getElementById(this.selectedFileName);
  if (selectedCheckbox) {
    selectedCheckbox.checked = true;
  }
  },
  selectFileName(name, event) {
    if (event.target.checked) {
        // The checkbox was checked
        // Retrieve the uniqueId associated with the selected fileName
        const selectedFileEntry = this.uniqueIdList.find(entry => entry.fileName === name);
        if (selectedFileEntry) {
          // Update the uniqueId in your component's data
          this.uniqueId = selectedFileEntry.uniqueId;
          localStorage.setItem('uniqueId', this.uniqueId);
          
          // Log the selected uniqueId (you can remove this in production)
          console.log(`Selected uniqueId for ${name}: ${this.uniqueId}`);
          
          // Now, you can proceed with updating the /question form data
        } else {
          console.warn(`No uniqueId found for ${name}`);
        }}
  },
  async postOrganizationName(organizationName) {
    console.log("Organization Name is " + organizationName)
    const data = JSON.stringify({
            organizationName: organizationName
          });

    const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://127.0.0.1:8000/organization',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          data: data
        };
        axios
          .request(config)
          .catch((error) => {
            console.log(error);
          });
  },
  async postCountry(selectedCountry) {
    const data = JSON.stringify({
            countryName: selectedCountry
          });

    const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://127.0.0.1:8000/country',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          data: data
        };
        axios
          .request(config)
          .catch((error) => {
            console.log(error);
          });
  },

      async sendMessage() {
        this.isLoading = true;
    this.clipboardSnippets = new ClipboardJS('.snippet', {
      text: trigger => trigger.getAttribute('data-title')
    });
        console.log('sendMessage method called');
        console.log("uniqe id is: " + this.uniqueId)
        if (this.currentMessage) {
          this.messages.push({
            text: this.currentMessage,
            isBot: false
          });
          this.fakeBotResponse(this.currentMessage);
          this.currentMessage = '';
          this.$nextTick(() => {
            this.scrollBottom();
          });
        }
      },
      clearCache() {
      localStorage.removeItem('uniqueId');
      localStorage.removeItem('uniqueIdList');
      localStorage.removeItem('fileNames');

      this.uniqueIdList = [];
    },
      fakeBotResponse(messageFromUser) {
        
        if (messageFromUser) {
          if (this.isPageRefresh() && this.uniqueId) {
            this.uniqueId = localStorage.getItem('uniqueId');
            const data = JSON.stringify({
            question: messageFromUser,
            uniqueId : this.uniqueId
          });
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://127.0.0.1:8000/question',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          data: data
        };
        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            this.isLoading = false;           
            let formattedResponse = response.data.trim().includes('-') ? response.data.replace(/- /g, '\n- ') : response.data;
            this.messages.push({
            text: response.data,
            isBot: true
            });
            this.currentMessage = '';
            this.$nextTick(() => {
              this.scrollBottom()
            });
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
          });
          
      }

        else if (!this.isPageRefresh()) {
          const data = JSON.stringify({
            question: messageFromUser,
            uniqueId : window.uniqueId
          });
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://127.0.0.1:8000/question',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          data: data
        };
        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            
            this.messages.push({
            text: response.data.trim(),
            isBot: true
            });
            this.currentMessage = '';
            this.$nextTick(() => {
              this.scrollBottom();
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }}}
      }}
      const snippets = document.querySelectorAll('.snippet');

for (let i = 0; i < snippets.length; i++) {
  snippets[i].addEventListener('mouseleave', clearTooltip);
  snippets[i].addEventListener('blur', clearTooltip);
}

function showTooltip(el, msg) {
  el.setAttribute('class', 'snippet tooltip');
  el.setAttribute('aria-label', msg);
}

function clearTooltip(e) {
  e.currentTarget.setAttribute('class', 'snippet');
  e.currentTarget.removeAttribute('aria-label');
}

const clipboardSnippets = new ClipboardJS('.snippet', {
  text: trigger => trigger.getAttribute('data-title')
});

clipboardSnippets.on('success', e => {
  e.clearSelection();
  showTooltip(e.trigger, 'Copied!');
});

clipboardSnippets.on('error', e => {
  showTooltip(e.trigger, 'Copy failed!');
});
  </script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
  @import url('https://fonts.cdnfonts.com/css/maximum-impact');
  

  .chatbot-container {
    height: 100%;
    width: 72%; /* 2/3 of the page */
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    overflow-x: hidden;
    padding-top: 0px;
    display: flex;
    flex-direction: column;
    background-color: #181e25;
    
  }
  
  .chatbot-header-container {
    font-family: 'Maximum Impact', sans-serif;
    font-size: 40px;
    font-weight: 300;
    line-height: 1.7em;
    height: 50px;
    background-color: #181e25;
    color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top:8.5px;
  }
  
  .split-screen {
    height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  overflow-x: hidden;
  padding-top: 0px;
  }
  .split-screenn {
    height: 100%;
  
  position: fixed;
  z-index: 1;
  top: 0;
  overflow-x: hidden;
  padding-top: 0px;
  }
  .organization-selection-container {
    height: 100%;
    width: 28%; /* 1/3 of the page */
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    overflow-x: hidden;
    padding-top: 0px;
    background-color: #818589;
   
  background-color: #12161b;
  }
  img {
    margin-bottom: 0px;
    max-width: 15%;
    max-height: 50px;
    position: absolute;
    left: 20px;
  }

  .chatbot-body-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative; 
  }

  .chatbot-body {
    width: 100%;

    overflow-y: auto;
    position: absolute; 
    top: 0; 
    left: 0; 
    bottom: 100px;
  }
  .file-btn {
      font-family: 'Lato', sans-serif;
      font-size: 14.3333px;
      margin-left: 15px;
      padding: 5px;
      border-radius: 8px;
      border: none;
      background-color: #280447;
      color: #fff;
      cursor: pointer;
  }

  .messages {
    width:100%;
    padding: 16px;
  }

  .bot-message {
    background-color: #6d5ca3;
    color : #ececf1;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 8px;
    margin-left: 50px; 
    position: relative; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .bot-message::before {
    content: "";
    position: absolute;
    top: 0;
    left: -50px; 
    width: 40px; 
    height: 40px; 
    background-size: cover;
    border-radius: 50%;
  }


  .user-message {
    background-color: #30344f;
    color : #ececf1;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 8px;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    word-wrap: break-word;
  }

  .input-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -1px;
  }

  .input {
    width: 100%;
    max-width: 750px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background-color: #fff;
    border-top: 1px solid #eee;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    align-items: center;
  }

  .organization-input {

    width: 100%;
    max-width: 310px;
    height: 60px;
    
    justify-content: space-between;
    align-items: center;
     /* Stack the input and button vertically on small screens */
    padding: 0 16px;
    background-color: #fff;
    border-top: 1px solid #eee;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin: auto;
    display: flex;
    margin-top: 100px;
  }
  
  .organization-input input {
    font-family: 'Lato', sans-serif;
    font-size: larger;
    flex: 1;
    margin-right: 16px;
    padding: 15px;
    border-radius: 8px;
    border: none;
    outline: none !important;
    width:100%;
  }
  .organization-section-header {
    font-family: 'Maximum Impact', sans-serif;
    font-size: 30px;
    font-weight: 300;
    line-height: 1.7em;
    height: 50px;
    background-color: #12161b;
    color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top:8.5px;
  }
  .input input {
    font-family: 'Lato', sans-serif;
    flex: 1;
    margin-right: 16px;
    padding: 8px;
    border-radius: 8px;
    border: none;
    font-size: medium;
    outline: none !important;
  }

  .input button {
    font-family: 'Lato', sans-serif;
    padding: 8px;
    border-radius: 8px;
    border: none;
    font-size: 15px;
    background-color: #280447;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .input:hover button:hover {
    background-color: rgb(161, 119, 237); /* Replace with the color you want */

  }
   .organization-input button {
    font-family: 'Lato', sans-serif;
    padding: 7px;
    border-radius: 8px;
    border: none;
    background-color: #280447;
    color: #fff;
    cursor: pointer;
    font-size: medium;
   } 
  .input button:hover {
    background-color: #280447;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
    
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }  

  .scroll-bottom-button {
    position: fixed;
    bottom: 90px;
    right: 20px;
    z-index: 999;
    width: 40px;
    height: 40px;
    background-color: #280447;
    color: #fff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    transition: background-color 0.3s ease;
  }
  .upload-btn {
    margin-left : 17px;
  }
  .scroll-bottom-button:before {
    content: '\2193';
    display: block;
    text-align: center;
    line-height: 40px;
  }

  .scroll-bottom-button:hover {
    background-color: #280447;
  }
  .country-selection-container {
    width: 100%;
    max-width: 310px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background-color: #fff;
    border-top: 1px solid #eee;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin: auto;
    margin-top: 100px;
    
  }
  .country-selection-container button {
    font-family: 'Lato', sans-serif;
    padding: 7px;
    border-radius: 8px;
    border: none;
    background-color: #280447;
    color: #fff;
    cursor: pointer;
    font-size: medium;
  }
  .country-selection-container select {
    font-family: 'Lato', sans-serif;
    font-size: larger;
    border: none;
    outline: none;
    width: 80%;
    }

    .investment-information {
  width: 70%;
  max-width: 80%;
  min-height: 80%;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: auto;
  margin-top: 50px;
  align-items: stretch;
  flex: 1; /* Add this line to make it grow vertically */

    
    }
    .organization-name {
    font-family:'Maximum Impact', sans-serif;
    text-overflow: ellipsis;
    font-size: 23px;
    margin-top: 0px;
    font-weight:100;
    line-height: 1.7em;
    height: 50px;
    color: #181e25;
    justify-content: center;
    align-items: center;
    padding-top:40px;
    justify-content: center;
    }
    .country {
      font-family:'Maximum Impact', sans-serif;
    font-size: 23px;
    margin-top: 20px;
    font-weight:100;
    line-height: 1.7em;
    height: 50px;
    color: #181e25;

    justify-content: center;
    align-items: center;
    
    padding-top:50px;
    width: 100%;
    }
    .fileNames {
      font-family:'Maximum Impact', sans-serif;
    font-size: 23px;
    margin-top: 30px;
    font-weight:100;
    line-height: 1.7em;
    color: #181e25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
    align-items: center;
    padding-top:50px;
    width: 100%;
    }
    .dot-overtaking {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background-color: transparent;
  color: #eee;
  margin: -1px 0;
  box-shadow: 0 -20px 0 0;
  margin-bottom : 150px;
  animation: dot-overtaking 2s infinite cubic-bezier(0.2, 0.6, 0.8, 0.2);
}
.dot-overtaking::before, .dot-overtaking::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background-color: transparent;
  color: #eeee;
  box-shadow: 0 -20px 0 0;

}
.dot-overtaking::before {
  animation: dot-overtaking 2s infinite cubic-bezier(0.2, 0.6, 0.8, 0.2);
  animation-delay: 0.3s;
}
.dot-overtaking::after {
  animation: dot-overtaking 1.5s infinite cubic-bezier(0.2, 0.6, 0.8, 0.2);
  animation-delay: 0.6s;
}

@keyframes dot-overtaking {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

  </style>
