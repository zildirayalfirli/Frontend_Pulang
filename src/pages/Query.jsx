import React, { useState, useEffect } from "react";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";

const Query = () => {
  const [userInput, setUserInput] = useState("");
  const [adminInput, setAdminInput] = useState("");
  const [userChat, setUserChat] = useState([]);
  const [adminChat, setAdminChat] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [lastGeneratedQuery, setLastGeneratedQuery] = useState("");
  const [lastCorrectedQuery, setLastCorrectedQuery] = useState("");
  const [queryEditor, setQueryEditor] = useState(null);
  const [resultViewer, setResultViewer] = useState(null);
  const [activeTab, setActiveTab] = useState("queryEditor");

  useEffect(() => {
    const queryEditorContainer = document.getElementById("queryEditor");
    const resultViewerContainer = document.getElementById("resultViewer");

    const queryEditorInstance = new JSONEditor(queryEditorContainer, {
      mode: "code",
      modes: ["code", "tree"],
      onChangeText: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          setLastCorrectedQuery(jsonString);
        } catch (e) {
          console.log("JSON parse error in editor:", e);
        }
      },
    });

    const resultViewerInstance = new JSONEditor(resultViewerContainer, {
      mode: "tree",
      modes: ["code", "tree"],
      onEditable: () => false,
    });

    queryEditorInstance.set({});
    resultViewerInstance.set({});

    setQueryEditor(queryEditorInstance);
    setResultViewer(resultViewerInstance);

    return () => {
      queryEditorInstance.destroy();
      resultViewerInstance.destroy();
    };
  }, []);

  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [userChat, adminChat]);

  const handleUserQuery = () => {
    if (!userInput.trim()) return;

    const newUserChat = [...userChat, { type: "user", content: userInput }];
    setUserChat(newUserChat);
    setCurrentQuestion(userInput);
    setUserInput("");

    fetch("http://localhost:5000/api/generate_query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userInput }),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        return response.text().then((text) => {
          console.log("Response text:", text);
          return text ? JSON.parse(text) : {};
        });
      })
      .then((data) => {
        if (data.success) {
          setLastGeneratedQuery(JSON.stringify(data.query));
          queryEditor.set(data.query);
          resultViewer.set(data.result || {});
          setUserChat([
            ...newUserChat,
            { type: "assistant", content: data.explanation },
            { type: "assistant-results", content: formatResults(data.result, data.resultCount) },
          ]);
          setAdminChat([...adminChat, { type: "system", content: `Generated query for: "${userInput}"<br>${formatQuery(data.query)}` }]);
          if (!data.resultCount) {
            setAdminChat([...adminChat, { type: "system", content: "No results found. You can provide a correction below." }]);
          } else {
            setAdminChat([...adminChat, { type: "system", content: `Found ${data.resultCount} results.` }]);
          }
        } else {
          setUserChat([...newUserChat, { type: "error", content: `Error: ${data.error}` }]);
          setAdminChat([...adminChat, { type: "error", content: `Error generating query: ${data.error}` }]);
        }
      })
      .catch((error) => {
        setUserChat([...newUserChat, { type: "error", content: `Error: ${error.message}` }]);
        console.error("Error:", error);
      });
  };

  const handleAdminCorrection = () => {
    if (!adminInput.trim()) return;
    if (!currentQuestion) {
      setAdminChat([...adminChat, { type: "error", content: "No active query to correct." }]);
      return;
    }

    setAdminChat([...adminChat, { type: "user", content: adminInput }]);
    setAdminInput("");

    if (adminInput.toLowerCase() === "yes") {
      if (!lastCorrectedQuery) {
        setAdminChat([...adminChat, { type: "error", content: "No correction to save." }]);
        return;
      }

      fetch("http://localhost:5000/api/correct_query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion, isConfirm: true, correctedQuery: JSON.parse(lastCorrectedQuery) }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setAdminChat([...adminChat, { type: "success", content: `✓ ${data.message}` }]);
          } else {
            setAdminChat([...adminChat, { type: "error", content: `Error: ${data.error}` }]);
          }
        })
        .catch((error) => {
          setAdminChat([...adminChat, { type: "error", content: `Error: ${error.message}` }]);
          console.error("Error:", error);
        });
      return;
    }

    fetch("http://localhost:5000/api/correct_query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: currentQuestion, feedback: adminInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLastCorrectedQuery(JSON.stringify(data.correctedQuery));
          queryEditor.set(data.correctedQuery);
          resultViewer.set(data.result || {});
          setAdminChat([...adminChat, { type: "assistant", content: `<strong>Corrected query:</strong><br>${formatQuery(data.correctedQuery)}` }]);
          setUserChat([
            ...userChat,
            { type: "assistant", content: `<strong>Corrected analysis:</strong><br>${data.explanation}` },
            { type: "assistant-results", content: formatResults(data.result, data.resultCount) },
          ]);
          setAdminChat([...adminChat, { type: "system", content: 'Type "yes" to save this correction for future similar queries.' }]);
        } else {
          setAdminChat([...adminChat, { type: "error", content: `Error: ${data.error}` }]);
        }
      })
      .catch((error) => {
        setAdminChat([...adminChat, { type: "error", content: `Error: ${error.message}` }]);
        console.error("Error:", error);
      });
  };

  const formatResults = (results, count) => {
    if (!results || !count) return "No results found for this query.";
    const displayLimit = 3;
    let displayResults = results.slice(0, displayLimit);
    let html = `<strong>Found ${count} results:</strong><br><br>`;
    if (count > displayLimit) html += `<em>Showing first ${displayLimit} results:</em><br><br>`;
    displayResults.forEach((result, index) => {
      html += `<div className="mb-2 p-2 bg-gray-100 rounded">`;
      const keys = Object.keys(result)
        .filter((k) => !k.includes("_id") && result[k] !== null && result[k] !== undefined)
        .slice(0, 5);
      keys.forEach((key) => {
        html += `<strong>${key}:</strong> ${JSON.stringify(result[key])}<br>`;
      });
      if (Object.keys(result).length > keys.length) {
        html += `<em>...and ${Object.keys(result).length - keys.length} more fields</em>`;
      }
      html += `</div>`;
    });
    if (count > displayLimit) html += `<em>...and ${count - displayLimit} more results</em>`;
    return html;
  };

  const formatQuery = (query) => {
    if (!query) return "No query available";
    try {
      return `<pre>${JSON.stringify(query, null, 2)}</pre>`;
    } catch (e) {
      return String(query);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen bg-white border-2 border-secondary-300 rounded-lg">
      <header className="text-center mb-6 pb-4 border-b border-secondary-300">
        <h1 className="text-4xl font-semibold text-secondary-300 mb-2">Database Query Assistant</h1>
        <p className="text-gray-700">Ask questions about your database.</p>
      </header>
      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="panel flex-1 flex flex-col bg-white rounded shadow overflow-hidden rounded-xl border-2 border-secondary-300">
          <div className="panel-header p-4 border-b border-gray-300 bg-white">
            <h2 className="text-xl font-semibold text-secondary-300 mb-1">User Chat</h2>
            <div className="panel-controls flex justify-between items-center">
              <p className="text-gray-700">Ask questions about your database here</p>
              <button className="clear-btn bg-red-500 text-white border border-gray-300 rounded px-2 py-1 text-xs hover:bg-red-700 hover:text-white">
                Clear Chat
              </button>
            </div>
          </div>
          <div className="chat-container flex-1 p-4 overflow-y-auto bg-gray-100">
            {userChat.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.type} mb-4 flex flex-col max-w-4/5 ${msg.type === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className={`message-content p-3 rounded shadow ${msg.type === "user" ? "bg-white text-right" : "bg-[#eac0a0] text-left"}`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                </div>
              </div>
            ))}
          </div>
          <div className="input-area flex p-4 bg-white border-t border-gray-300">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded text-sm focus:border-blue-500"
              placeholder="Type your question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUserQuery()}
            />
            <button className="ml-2 p-3 bg-secondary-300 text-white rounded text-sm hover:bg-secondary-500" onClick={handleUserQuery}>
              Send
            </button>
          </div>
        </div>
        <div className="panel flex-1 flex flex-col bg-white rounded shadow overflow-hidden rounded-lg border-2 border-secondary-300">
          <div className="panel-header p-4 border-b border-gray-300 bg-white">
            <h2 className="text-xl font-semibold text-secondary-300 mb-1">Admin Panel</h2>
            <div className="panel-controls flex justify-between items-center">
              <p className="text-gray-700">Provide corrections and view detailed information</p>
              <button className="clear-btn bg-red-500 text-white border border-gray-300 rounded px-2 py-1 text-xs hover:bg-red-700 hover:text-white">
                Clear Chat
              </button>
            </div>
          </div>
          <div className="chat-container flex-1 p-4 overflow-y-auto bg-gray-100">
            {adminChat.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.type} mb-4 flex flex-col max-w-4/5 ${msg.type === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className={`message-content p-3 rounded shadow ${msg.type === "user" ? "bg-white text-right" : "bg-[#eac0a0] text-left"}`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                </div>
              </div>
            ))}
          </div>
          <div className="input-area flex p-4 bg-white border-t border-gray-300">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded text-sm focus:border-blue-500"
              placeholder="Enter correction or type 'yes' to save..."
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdminCorrection()}
            />
            <button className="ml-2 p-3 bg-secondary-300 text-white rounded text-sm hover:bg-secondary-500" onClick={handleAdminCorrection}>
              Submit
            </button>
          </div>
          <div className="json-editor-container border-t border-gray-300 h-80 flex flex-col">
            <div className="json-editor-header flex bg-gray-200 border-b border-gray-300">
              <div
                className={`tab p-3 cursor-pointer text-sm font-medium ${
                  activeTab === "queryEditor" ? "border-b-2 border-secondary-300 text-secondary-300" : "text-gray-700"
                }`}
                onClick={() => setActiveTab("queryEditor")}
              >
                Query
              </div>
              <div
                className={`tab p-3 cursor-pointer text-sm font-medium ${
                  activeTab === "resultViewer" ? "border-b-2 border-secondary-300 text-secondary-300" : "text-gray-700"
                }`}
                onClick={() => setActiveTab("resultViewer")}
              >
                Results
              </div>
            </div>
            <div className="json-editors flex-1 relative">
              <div
                id="queryEditor"
                className={`json-editor absolute top-0 left-0 w-full h-full ${activeTab === "queryEditor" ? "block" : "hidden"}`}
              ></div>
              <div
                id="resultViewer"
                className={`json-editor absolute top-0 left-0 w-full h-full ${activeTab === "resultViewer" ? "block" : "hidden"}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Query;
