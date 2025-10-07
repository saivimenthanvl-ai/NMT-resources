import sqlite3
from datasets import Dataset, concatenate_datasets
from transformers import MarianMTModel, MarianTokenizer, Seq2SeqTrainer, Seq2SeqTrainingArguments, DataCollatorForSeq2Seq

DB_PATH = "backend/feedback.db"

# 1. Load all feedback grouped by language pairs
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute("SELECT source_lang, target_lang, source_text, user_correction FROM feedback WHERE user_correction IS NOT NULL")
rows = cur.fetchall()
conn.close()

if not rows:
    print("No feedback found.")
    exit()

datasets = []
for src_lang, tgt_lang, src_text, tgt_text in rows:
    pair_code = f"{src_lang}-{tgt_lang}"
    model_name = {
        "en-ta": "Helsinki-NLP/opus-mt-en-tam",
        "en-kn": "Helsinki-NLP/opus-mt-en-kn",
        "en-hi": "Helsinki-NLP/opus-mt-en-hi",
    }.get(pair_code)
    if not model_name:
        continue

    tokenizer = MarianTokenizer.from_pretrained(model_name)
    model = MarianMTModel.from_pretrained(model_name)

    data = Dataset.from_dict({"src": [src_text], "tgt": [tgt_text]})
    def preprocess(batch):
        model_inputs = tokenizer(batch["src"], max_length=128, truncation=True)
        with tokenizer.as_target_tokenizer():
            labels = tokenizer(batch["tgt"], max_length=128, truncation=True)
        model_inputs["labels"] = labels["input_ids"]
        return model_inputs

    tokenized = data.map(preprocess, batched=True)
    datasets.append(tokenized)

if not datasets:
    print("No valid datasets.")
    exit()

combined = concatenate_datasets(datasets)

args = Seq2SeqTrainingArguments(
    output_dir="./fine_tuned_multilingual",
    per_device_train_batch_size=4,
    num_train_epochs=1,
    save_strategy="epoch",
    logging_strategy="epoch"
)

trainer = Seq2SeqTrainer(
    model=model,
    args=args,
    train_dataset=combined,
    data_collator=DataCollatorForSeq2Seq(tokenizer, model=model)
)

trainer.train()
model.save_pretrained("./fine_tuned_multilingual")
tokenizer.save_pretrained("./fine_tuned_multilingual")

print("✅ Multilingual fine-tuning completed.")
