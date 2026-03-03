import pandas as pd
import numpy as np
import xgboost as xgb
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

print("Loading data...")
df = pd.read_csv("data/creditcard.csv")

X = df.drop("Class", axis=1)
y = df["Class"]

# Class imbalance ratio
neg, pos = (y == 0).sum(), (y == 1).sum()
scale_pos_weight = neg / pos
print(f"Total transactions: {len(df):,}")
print(f"Fraud cases: {pos:,} ({(pos/len(df)*100):.2f}%)")
print(f"Scale pos weight: {scale_pos_weight:.1f}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

print("\nTraining XGBoost model...")
model = xgb.XGBClassifier(
    n_estimators          = 300,
    max_depth             = 6,
    learning_rate         = 0.05,
    subsample             = 0.8,
    colsample_bytree      = 0.8,
    scale_pos_weight      = scale_pos_weight,
    eval_metric           = "auc",
    early_stopping_rounds = 20,
    random_state          = 42,
    tree_method           = "hist"
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=50
)

# Evaluate
y_pred  = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print("\n=== Results ===")
print(classification_report(y_test, y_pred))
print(f"AUC Score: {roc_auc_score(y_test, y_proba):.4f}")
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Save model
output_path = "../backend/app/ml/model.pkl"
with open(output_path, "wb") as f:
    pickle.dump(model, f)

print(f"\n✅ Model saved to {output_path}")