import React, { useState, useEffect, useCallback } from 'react';
import './assets/styles/style.css';
import { AnswersList, Chats } from './components';
import FormDialog from './components/forms/FormDialog';
import { db } from './firebase/index';

const App = () => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState("init");
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);

  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question'
    })

    setAnswers(nextDataset.answers)
    setCurrentId(nextQuestionId)
  }

  const selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch(true) {
      //contactの場合はダイアログを開く
      case (nextQuestionId === 'contact'):
        handleClickOpen();
        break;

      //urlの場合はリンクを別タブで開く
      case (/^http*/.test(nextQuestionId)):
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank'; //別タブで開く
        a.click();
        break;

      //それ以外の場合はチャット画面に選択したチャットを加えて表示
      default:
        addChats({
          text: selectedAnswer,
          type: 'answer'
        })

        setTimeout(() => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]), 1000);
        break;
    }
  }

  const addChats = (chat) => {
    setChats(prevChats => {
      return [...prevChats, chat]
    })
  }

  //子のコンポーネントに渡さないのでuseCallbackしなくて良い
  const handleClickOpen = () => {
    setOpen(true)
  };

  //子のコンポーネントに渡すのでuseCallback化する
  const handleClose = useCallback(() => {
    setOpen(false)
  },[setOpen])

  useEffect(() => {
    (async() => {
      const initDataset = {};

      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          const id = doc.id
          const data = doc.data()
          initDataset[id] = data
        })
      });

      setDataset(initDataset)
      displayNextQuestion(currentId, initDataset[currentId])
    })();
  },[])

  useEffect(() => {
    const scrollArea = document.getElementById("scroll-area")
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  })

  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList
          answers={answers}
          select={selectAnswer}
        />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}

export default App;