import type { Recipe, Task } from '../types'

interface RecipeBookProps {
  recipes: Recipe[]
  onRecipeClick: (recipe: Recipe) => void
  onTaskDragStart?: (recipe: Recipe, task: Task, orderId: number) => void
}

export function RecipeBook({ recipes, onRecipeClick, onTaskDragStart }: RecipeBookProps) {
  const handleTaskDragStart = (e: React.DragEvent, recipe: Recipe, task: Task) => {
    const orderId = Date.now() // Temporary ID, will be replaced when dropped
    if (onTaskDragStart) {
      onTaskDragStart(recipe, task, orderId)
    }
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div style={{ 
      width: '200px', 
      background: '#252525', 
      padding: '10px',
      overflowY: 'auto',
      height: '100%',
      position: 'relative',
      zIndex: 10001 // Ensure recipe book is above tutorial overlay
    }}>
      <div className="recipe-book">
        <h3 style={{ marginBottom: '10px', color: '#fff' }}>Recipes</h3>
      {recipes.map(recipe => (
        <div key={recipe.id}>
          <div
            className="recipe-item"
            style={{
              padding: '8px',
              marginBottom: '8px',
              background: '#333',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid transparent',
              position: 'relative',
              zIndex: 10000 // Ensure recipe items are above tutorial overlay
            }}
            onClick={(e) => {
              e.stopPropagation() // Prevent event bubbling
              onRecipeClick(recipe)
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3a3a3a'
              e.currentTarget.style.borderColor = '#4A90E2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#333'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{recipe.name}</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>
              ${recipe.price} • {recipe.tasks.length} tasks
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
              Difficulty: {'⭐'.repeat(recipe.difficulty)}
            </div>
          </div>
          {/* Individual task drag handles */}
          {onTaskDragStart && recipe.tasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleTaskDragStart(e, recipe, task)}
              style={{
                padding: '4px 8px',
                marginBottom: '4px',
                marginLeft: '12px',
                background: '#2a2a2a',
                borderRadius: '4px',
                cursor: 'grab',
                fontSize: '11px',
                color: '#aaa',
                border: '1px dashed #555'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333'
                e.currentTarget.style.borderColor = '#4A90E2'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2a2a2a'
                e.currentTarget.style.borderColor = '#555'
              }}
            >
              {task.name} ({task.station})
            </div>
          ))}
        </div>
      ))}
      </div>
    </div>
  )
}

