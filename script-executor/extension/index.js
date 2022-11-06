Editors = (function () {
  var editors = {
    ace: null,
    monaco: null,
    textarea: null
  };
  
  function createAceEditor(cb) {
    getSavedScript(function (data) {
      var el = document.createElement('div');
      el.setAttribute('id','ace-editor');
      el.textContent = data['script'] || '';
      document.getElementById('editor-container').appendChild(el);

      var editor = ace.edit(el);
      editor.setTheme("ace/theme/monokai");
      editor.setFontSize(13);
      editor.getSession().setMode("ace/mode/javascript");
      editor._setValue = editor.setValue;
      editor.setValue = function(value,cursorPos=-1) {
        editor._setValue(value,cursorPos);
      }
      cb(editor);
    });
  }

  function createMonacoEditor(cb) {
    var el = document.createElement('div');
    el.setAttribute('id', 'monaco-editor');
    // el.setAttribute('style', "width:500px;height:400px;border:1px solid grey");
    document.getElementById('editor-container').appendChild(el);

    require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
    require(['vs/editor/editor.main'], function() {
      var editor = monaco.editor.create(el, {
        value: '',
        language: 'javascript',
        theme: 'vs-dark'
      });

      cb(editor);
    });
  }

  function createTextAreaEditor(cb) {
    var scriptTextArea = document.getElementById('script-textarea');
    cb({
      getValue: function() {
        return scriptTextArea.value;
      },
      setValue: function(value) {
        scriptTextArea.value = value;
      }
    });
  }

  function getEditor(name, cb) {
    var editor = editors[name];
    if (editor) {
      cb(editor);
      return ;
    }

    switch (name) {
      case 'ace':
        createAceEditor(editorCreated);
      break;

      case 'monaco':
        createMonacoEditor(editorCreated);
      break;

      case 'textarea':
        createTextAreaEditor(editorCreated);
      break;

      default:
        cb(null);
      break;
    }

    function editorCreated(editor) {
      editors[name] = editor;
      cb(editor)
    }
  }

  function Editors() {}
  Editors.prototype.getEditor = function(cb) {
    // return getEditor('monaco', cb);
    return getEditor('ace', cb);
  };
  return new Editors();
})();

function getSavedScript(cb) {
  chrome.storage.local.get('script',cb);
}
document.addEventListener('DOMContentLoaded', function() {
  Editors.getEditor(function(editor) {
    if (!editor) {
      throw "editor could not be created";
    }

    getSavedScript(function (data) {
      var script = data['script'];
      if (script) {
        editor.setValue(script);
      }
    });

    var buttonSave = document.getElementById('button-save');
    buttonSave.addEventListener('click', saveData);
    function saveData() {
      chrome.storage.local.set({
        'script': editor.getValue()
      }, function(){
        // window.close();
      });
    }

    window.onkeydown = function(e) {
      if(e.ctrlKey && e.keyCode == 83) {
        e.preventDefault();
        saveData();
      }
    };
  });

  // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // });
});


