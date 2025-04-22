import pygame
import random

# Инициализация PyGame
pygame.init()

# Настройки окна
SCREEN_WIDTH = 600
SCREEN_HEIGHT = 400
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Jump Game")

# Цвета
WHITE = (255, 255, 255)
ORANGE = (255, 165, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
RED = (255, 0, 0)
BLACK = (0, 0, 0)

# Настройки игрока
player_size = 50
player_x = 300
player_y = 200
player_speed = 25
gravity = 0.8

# Состояния игры
game_on = False
first_start = True
count = 0
speed = 25
colors = [WHITE, ORANGE, GREEN, BLUE]
prev_score = 0
class Obstacle:
    def __init__(self):
        self.size = random.randint(15, 30)
        self.x = 600
        self.y = random.randint(50, 290)
        self.color = random.choice(colors)
    
    def reset(self):
        self.size = random.randint(15, 30)
        self.x = 600
        self.y = random.randint(50, 290)
        self.color = random.choice(colors)

obstacle = Obstacle()

def is_collision(player_rect, obstacle):
    return player_rect.colliderect(pygame.Rect(obstacle.x, obstacle.y, obstacle.size, obstacle.size))

def game_over():
    global count, player_y, speed, game_on, prev_score
    prev_score = count #Добавил костыль для сохранения предыдущего счёта, по хорошему нужен класс состояние игры
    count = 0
    player_y = 200
    speed = 25
    game_on = False

# Игровой цикл
running = True
clock = pygame.time.Clock()
dt = 0

while running:
    screen.fill(BLACK)
    
    # Обработка событий
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                # Обработка прыжка
                count += 1
                if game_on:
                    player_y -= 25
                else:
                    player_y = 200
                
                if speed > 25:
                    speed -= 20
                
                if not game_on and not first_start:
                    pygame.time.delay(200)
                    game_on = True
                    obstacle.reset()
                
                if first_start:
                    first_start = False
                    game_on = True

    # Обновление игровой логики
    if game_on:
        # Гравитация
        speed += 50 * dt
        player_y += speed * dt
        
        # Движение препятствия
        obstacle.x -= speed * dt + random.randint(1, 2)
        
        # Проверка коллизий
        player_rect = pygame.Rect(player_x, player_y, player_size, player_size)
        if is_collision(player_rect, obstacle) or player_y < 0 or player_y + player_size > 400:
            game_over()
        
        # Сброс препятствия
        if obstacle.x + obstacle.size < 0:
            obstacle.reset()
            count += 10

    # Отрисовка
    # Игрок
    pygame.draw.rect(screen, ORANGE, (player_x, player_y, player_size, player_size), 2)
    
    # Препятствие
    pygame.draw.rect(screen, obstacle.color, (obstacle.x, obstacle.y, obstacle.size, obstacle.size))
    
    # Интерфейс
    font = pygame.font.Font(None, 36)
    text = font.render(f"Score: {count}", True, WHITE)
    screen.blit(text, (20, 20))
    
    if not game_on and not first_start:
        text = font.render(f"Game Over - Press SPACE Score: {prev_score}", True, RED)
        screen.blit(text, (SCREEN_WIDTH//2 - 150, SCREEN_HEIGHT//2))

    pygame.display.flip()
    dt = clock.tick(60) / 1000

pygame.quit()