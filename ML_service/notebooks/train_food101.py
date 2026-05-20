import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import time
import os

def main():
    print("=== BiteWise: Тренування EfficientNetB0 на Food-101 ===")
    
    # 1. Визначення пристрою для розрахунків
    # Mac на процесорах M1/M2/M3 використовують "mps" (Metal Performance Shaders)
    if torch.cuda.is_available():
        device = torch.device("cuda:0")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
        print("\n[УВАГА] Використовується звичайний процесор (CPU). Тренування буде ДУЖЕ довгим!")
        
    print(f"Використовуємо пристрій: {device}")

    # 2. Підготовка даних (Трансформації)
    train_transforms = transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    print("\n[1/4] Завантаження датасету Food-101 (~5 ГБ)...")
    # Параметр download=True автоматично завантажить датасет, якщо його ще немає в папці ./data
    train_dataset = datasets.Food101(root='./data', split='train', download=True, transform=train_transforms)
    
    # DataLoader розбиває наші 75,000 тренувальних картинок на пачки (батчі) по 32 штуки
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=4)
    classes = train_dataset.classes
    print(f"Кількість страв: {len(classes)}. Загальна кількість картинок: {len(train_dataset)}")

    # 3. Підготовка моделі
    print("\n[2/4] Підготовка базової моделі EfficientNetB0...")
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)

    # Заморожуємо базові шари (щоб зберегти здатність моделі 'бачити' текстури)
    for param in model.parameters():
        param.requires_grad = False

    # Замінюємо останній шар на наші 101 клас
    num_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_features, 101) 
    
    model = model.to(device)

    # 4. Налаштування тренування
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier[1].parameters(), lr=0.001)

    print("\n[3/4] Початок тренувального циклу...")
    epochs = 3 # Для локального запуску краще почати з 3 епох, бо це довго
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        start_time = time.time()
        
        # Проходимося по всіх батчах
        for i, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            
            # Вперед
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            
            # Назад
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            
            # Виводимо прогрес кожні 100 батчів, щоб бачити, що програма не зависла
            if i % 100 == 99:
                print(f"  Епоха {epoch+1}, Батч {i+1}/{len(train_loader)}... Loss: {running_loss/100:.4f}")
                running_loss = 0.0
                
        epoch_time = time.time() - start_time
        print(f"--- Епоха {epoch+1} завершена за {epoch_time/60:.2f} хвилин ---\n")

    # 5. Збереження моделі
    print("\n[4/4] Збереження натренованої моделі...")
    os.makedirs("app/models", exist_ok=True) # Переконуємось, що папка існує
    save_path = "app/models/efficientnet_food101.pth"
    torch.save(model.state_dict(), save_path)
    print(f"Готово! Модель успішно збережено у файл: {save_path}")

if __name__ == "__main__":
    main()
