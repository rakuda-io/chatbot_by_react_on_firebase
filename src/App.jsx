import React, { useState, useEffect, useCallback } from 'react';
import './assets/styles/style.css';
import { AnswersList, Chats, Loading } from './components';
import { FormDialog } from './components/forms/index';
import { db } from './firebase/index';

const App = () => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState("init");
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);

  //新しいチャットを追加するcallback関数
  const addChats = useCallback((chat) => {
    setChats(prevChats => {
      return [...prevChats, chat]
    })
  }, [setChats])

  //問い合わせフォームモーダルを開くcallback関数
  const handleClickOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen]);

  //問い合わせフォームモーダルを閉じるcallback関数
  const handleClose = useCallback(() => {
    setOpen(false)
  },[setOpen])

  //次の質問をチャットエリアに表示する関数
  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    //選択された回答と次の質問をチャットに追加
    addChats({
      text: nextDataset.question,
      type: 'question'
    })

    //次の回答一覧をセット
    setAnswers(nextDataset.answers)

    //現在の質問IDをセット
    setCurrentId(nextQuestionId)
  }

  //回答が選択された時に呼ばれる関数
  const selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch(true) {
      //お問合せが選択された場合はダイアログを開く
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

      //それ以外の場合は選択した回答をチャットを加えて表示
      default:
        //現在のチャット一覧を取得
        addChats({
          text: selectedAnswer,
          type: 'answer'
        })

        setTimeout(() => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]), 1000);
        break;
    }
  }

  //最初のみrenderする処理（ComponentDidMount)
  //最初の質問をチャットエリアに表示する
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

      //Firestoreから取得したデータセットを反映
      setDataset(initDataset);

      //最初の質問を表示
      displayNextQuestion(currentId, initDataset[currentId])
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  //更新された時毎回行う処理（ComponentDidUpdate)
  //最新のチャットが見えるようにスクロール位置の頂点をスクロール領域の最下部に設定する
  useEffect(() => {
    const scrollArea = document.getElementById("scroll-area")
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  })//毎回行うので第2引数はなし

  return (
    <section className="c-section">
      <div className="c-box">
        {(Object.keys(dataset).length === 0) ? (
          <Loading />
        ) : (
          <>
            <Chats chats={chats} />
            <AnswersList
              answers={answers}
              select={selectAnswer}
              />
          </>
          )}
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}

export default App;